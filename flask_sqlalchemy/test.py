# coding: utf-8
from gcloud import storage
from gcloud.storage import Blob
import uuid

client = storage.Client(project='fire-193914')
bucket = client.get_bucket('wagtailqlbucket')

# note: ne gere pas les operations concurrentes. Le service
# est utilisé par une ou deux personnes max.
def upload_to_default_bucket(file):
    print "uploading file***"
    uuid_   = uuid.uuid4().hex
    blob    = Blob('upload/' + uuid_, bucket)
    blob.content_type = "image/jpeg"

    blob.upload_from_file(file)
    return uuid_

def synch_from_default_bucket(uid_file, file_name):
    blob = bucket.get_blob("upload/" + uid_file)
    print "blob for ", uid_file, blob, blob.public_url
    if blob == None:
        return ""
    else:
        perm_blob = bucket.copy_blob(blob, bucket, new_name="upload/" + file_name + uid_file)
        bucket.delete_blobs([blob])
        
        return perm_blob.public_url
