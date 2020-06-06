""" Django specific ORM models for Images. We don't need one currently
But we can replace the firestore mechanism with a custom model
"""
import os
import subprocess
import time
from threading import Thread

from google.cloud.firestore_v1beta1 import ArrayUnion

from api.events.models import Event


def asyncfunc(function):
    """ Wrapper for async behaviour. Executes function in a separate new thread
    """

    def decorated_function(*args, **kwargs):
        threads = Thread(target=function, args=args, kwargs=kwargs)
        # Make sure thread doesn't quit until everything is finished
        threads.daemon = False
        threads.start()

    return decorated_function


class Image(object):
    field_name = 'images'
    path = field_name + '/'

    def __init__(self, is_nsfw=False, is_trusted=False, uuid='', name=''):
        self.is_nsfw = is_nsfw
        self.is_trusted = is_trusted
        self.uuid = uuid
        self.name = name

    def save(self, incident_id, db):
        db.collection(Event.collection_name).document(incident_id).update({u'images': ArrayUnion([self.to_dict()])})
        return self.uuid

    def put(self, storage):
        storage.child(Image.path + self.uuid).put(self.name)

    def create_thumbnail(self, storage):
        self.__create_thumbnail__(self.name, storage)

    @asyncfunc
    def __create_thumbnail__(self, name, storage):
        """ Starts the job of creating svg based thumbnail for a given file

        Arguments:
            name {string} -- [ target file name ]
        """
        # As our load is small now, we can do this in sequential manner
        # After we get enough traffic we should use a redis based solution.
        # Where an event would be pushed and a job id is to be returned
        # and expose another endpoint where we can check the status
        print("Generating Thumbnail", time.time())
        subprocess.run(['node_modules/.bin/sqip', name, '-o', name + '.svg'])
        storage.child('thumbnails/' + name + '.svg').put(name + '.svg')
        # Remove the uploaded files for two good reasons:
        # Keep our dyno clean
        # remove malicious code before anything goes wrong.
        os.remove(name)
        os.remove(name + '.svg')
        print("Finished", time.time())

    @staticmethod
    def from_dict(source_dict):
        image = Image(source_dict['isNsfw'], source_dict['isTrusted'], source_dict['uuid'])
        return image

    def to_dict(self):
        image_dict = {
            "isNsfw": self.is_nsfw,
            "isTrusted": self.is_trusted,
            "uuid": self.uuid,
        }
        return image_dict
