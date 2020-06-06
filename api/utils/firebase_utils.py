from django.conf import settings
import os
import requests

db = settings.FIRESTORE

def delete_collection(coll_ref, batch_size=5):
    docs = coll_ref.limit(batch_size).get()
    deleted = 0

    for doc in docs:
        doc.reference.delete()
        deleted = deleted + 1

    if deleted >= batch_size:
        return delete_collection(coll_ref, batch_size)

def exchange_refresh_token():
    print('refreshing for Id token')
    r = requests.post('https://securetoken.googleapis.com/v1/token?key=' + os.environ['REACT_APP_FIREBASE_API_KEY'], data={'refresh_token': os.getenv('FIREBASE_USER_REFRESH_TOKEN'), 'grant_type': 'refresh_token'})
    return r.json()['id_token']

def get_authenticated_user_token():
    return exchange_refresh_token()

def get_anonymous_user_token():
    r = requests.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + os.environ['REACT_APP_FIREBASE_API_KEY'], data={'returnSecureToken': True})
    print(r.json())
    return r.json()['idToken']

def delete_anonymous_user(idToken):
    r = requests.post('https://identitytoolkit.googleapis.com/v1/accounts:delete?key=' + os.environ['REACT_APP_FIREBASE_API_KEY'], data={'idToken': idToken})
    return r.status_code
