from gcloud.exceptions import NotFound
from gcloud import storage

client = storage.Client()
bucket = client.get_bucket("wagtailqlbucket")
