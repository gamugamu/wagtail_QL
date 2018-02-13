from gcloud import storage
from gcloud.storage import Blob

client = storage.Client(project='fire-193914')
bucket = client.get_bucket('wagtailqlbucket')
blob    = Blob('test-base.jpg', bucket)
