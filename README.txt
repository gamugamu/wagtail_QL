installation minio (gestion cloud/bucket) depuis docker. Est nécessaire afin de stocker les images du pma.
docker run -p 9000:9000 -e "MINIO_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE" -e "MINIO_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" minio/minio server /data

https://github.com/minio/minio-py/blob/master/docs/API.md
from minio import Minio
from minio.error import ResponseError

minioClient = Minio('127.0.0.1:9000', access_key='AKIAIOSFODNN7EXAMPLE', secret_key='wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY', secure=False)
minioClient.make_bucket("maylogs")
minioClient.list_buckets()
// [<minio.definitions.Bucket object at 0x10f67f890>]


instalation backend
// configurer que le back pointe sur le bon cloud minio bucket (pas encore fait)
docker build -t cryptodraco/flask_gql:v0.X.x .
docker push cryptodraco/flask_gql:v0.X.x // pour remote
docker run -it -p 80:8080 -m 256m --memory-swap=256m  cryptodraco/flask_gql:v0.X.x

installation front
// configurer que le front pointe sur le bon back depuis front-client/src/config.js
docker build -t cryptodraco/front_gql:v0.X.x .
docker push cryptodraco/front_gql:v0.X.x // pour remote
docker run -it -p 80:8080 -m 256m --memory-swap=256m  cryptodraco/front_gql:v0.X.x
