from rest_framework.views import APIView
from rest_framework import permissions
from api.firebase_auth.authentication import TokenAuthentication
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.conf import settings
import json
import time

db = settings.FIREBASE.database()
SLEEP_SECONDS = 20

class UpvoteView(APIView):
    """API view class for upvotes
    """
    authentication_classes = (TokenAuthentication,)
    permissions_classes = (permissions.IsAuthenticatedOrReadOnly)

    def get(self, request):
        """Returns the number of upvotes for a specific uuid &
        if the user is authenticated then whether the user has upvoted the uuid

        This method is called from the client when it wants to check if there are
        any new upvote's count of a given "uuid" upvote.

        The backend is checked every second for SLEEP_SECONDS. If there are no new
        upvotes in this interval, response is returned with current_count 
        and the client may initiate a new request.

        The result of this method, when upvote's count change are available
        is json similar to below:

        {
            'uuid': uuid,
            'count': count,
            'has_upvoted': has_upvoted,
        }
        """
        
        uuid = request.GET.get('uuid')
        current_count = request.GET.get('current_count')        
        if not uuid:
            return HttpResponseBadRequest("BadRequest: uuid not specified")
        
        if not current_count:
            current_count = -1

        try:
            current_count = int(current_count)
        except:
            return HttpResponseBadRequest("BadRequest: current_count must be an integer")
        
        path = 'upvotes/' + uuid

        for _ in range(SLEEP_SECONDS):
            count = db.child(path + '/count').get().val()
            if count is None:
                count = 0

            if current_count == -1:
                # send the reponse of the initial request immediately
                has_upvoted = self.get_has_upvoted(request, path)
                return JsonResponse({
                    'uuid': uuid,
                    'count': count,
                    'has_upvoted': has_upvoted,
                })

            if count == current_count:
                time.sleep(1)
                continue

            # send the reponse as update is available
            has_upvoted = self.get_has_upvoted(request, path)
            return JsonResponse({
                'uuid': uuid,
                'count': count,
                'has_upvoted': has_upvoted,
            })

        has_upvoted = self.get_has_upvoted(request, path)
        return JsonResponse({
            'uuid': uuid,
            'count': current_count,
            'has_upvoted': has_upvoted,
        })
               
    def post(self, request):
        """Lets a user to upvote a specific uuid
        """

        uuid = request.GET.get('uuid')
        if not uuid:
            return HttpResponseBadRequest("BadRequest: uuid not specified")
        
        user_id = str(request.user)
        # Check if upvote uuid exists on the database & get the upvotes
        path = 'upvotes/' + uuid
        user_upvote_path = path + '/upvoters/' + user_id
        # Get the uuid data
        count = db.child(path + '/count').get().val()
        # Make sure to initialize count
        if not count:
            count = 0
        has_upvoted = db.child(user_upvote_path + '/has_upvoted').get().val()
        # If the user has not upvoted the event, update the user entry
        # Else decrease the count
        new_count = count
        if not has_upvoted:
            db.child(user_upvote_path).update({
                'has_upvoted': True,
            })
            db.child(path).update({
                'count': count + 1,
            })
            new_count += 1
        else:
            db.child(user_upvote_path).update({
                'has_upvoted': False,
            })
            db.child(path).update({
                'count': count - 1,
            })
            new_count -= 1

        # Return the count and the uuid
        return JsonResponse({
            'uuid': uuid,
            'count': new_count,
            'has_upvoted': not has_upvoted,
        }, safe=False)

    def get_has_upvoted(self, request, path):
        has_upvoted = False        
        if request.user.is_authenticated:
            user_id = str(request.user)
            user_upvote_path = path + '/upvoters/' + user_id + '/has_upvoted'
            has_upvoted = db.child(user_upvote_path).get().val()

        return has_upvoted
