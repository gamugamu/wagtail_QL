# coding: utf-8
from gcloud import storage
from gcloud.storage import Blob
import uuid

client = storage.Client(project='fire-193914')
bucket = client.get_bucket('wagtailqlbucket')

# note: ne gere pas les operations concurrentes. Le service
# est utilisé par une ou deux personnes max.
def upload_to_default_bucket(file):
    uuid_   = uuid.uuid4().hex
    blob    = Blob('upload/' + uuid_, bucket)
    blob.content_type = "image/jpeg"

    blob.upload_from_file(file)
    return blob.public_url
