# coding: utf-8
import uuid

from minio import Minio
from minio.error import ResponseError
from minio.policy import Policy

BUCKET_NAME         = "backpmaql"
minioClient         = None
DOMAINE_NAME        = ""
bucket_url_is_https = False
# note: Minio genere un etag (md5) pour chaque image. Et permet de prevenir tout type de doublon
# (images). Le problème c'est qu'il le calcul après avoir uploadé l'image, or on en a besoin avant
# afin de nommer l'image par son checksum.
def md5(file):
    import hashlib
    hash_md5 = hashlib.md5()
    hex_digest = hashlib.md5(file.read()).hexdigest()
    file.seek(0)

    return hex_digest

def size(file):
    size = len(file.read())
    # repointe le curseur à 0 car minioClient va relire le stream à nouveau et lui ne connait pas la taille
    # du fichier
    file.seek(0)
    return size

def setup_minio_bucket(domaine_name, url_is_https=False):
    global minioClient, BUCKET_NAME, DOMAINE_NAME, bucket_url_is_https

    DOMAINE_NAME        = domaine_name
    bucket_url_is_https = url_is_https
    minioClient         = Minio(domaine_name,
    #TODO clé a cacher
                    access_key  = 'AKIAIOSFODNN7EXAMPLE',
                    secret_key  = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
                    secure      = False)

    # un bucket dedié aux upload d'image doit exister. Si il n'existe pas le créer.
    if minioClient.bucket_exists(BUCKET_NAME) is False:
        # location n'a pas d'importance puisqu'heberger sur nos propre serveur
        minioClient.make_bucket(BUCKET_NAME, location="eu-west-1")

def config_minio_bucket():
    global minioClient, BUCKET_NAME
    print "config_minio_bucket change policy"
    minioClient.set_bucket_policy(BUCKET_NAME, '*', Policy.READ_ONLY)

def url_fromFileName(fileName):
    global bucket_url_is_https
    protocol = 'https://' if bucket_url_is_https is True else 'http://'

    return protocol + DOMAINE_NAME + '/' + BUCKET_NAME + '/' + fileName

# note: ne gere pas les operations concurrentes. Le service
# est utilisé par une ou deux personnes max.
def upload_to_default_bucket(file):
    global minioClient, BUCKET_NAME
    file_size   = size(file)
    hex_name    = md5(file)

    try:
        import os
        ext        = os.path.splitext(file.filename)[1]
        full_name  = hex_name + ext

        tag = minioClient.put_object(BUCKET_NAME, full_name, file,
            length          = file_size,
            content_type    = file.content_type)

        return url_fromFileName(full_name)

    except ResponseError as err:
        return "error"

# debug
def list_bucket():
    buckets = minioClient.list_buckets()
    for bucket in buckets:
        print(bucket.name, bucket.creation_date)
