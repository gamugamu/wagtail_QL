Le projet use kubernet

Minikube + kubernet en local
Gcloud + kubernet en prod.


(When switching back and forth between Container Engine and Minikube):

# En prod
#graphql-test est le nom du cluster

gcloud container clusters get-credentials graphql-test --zone europe-west1-b

# En dev
# minikube start --vm-driver=xhyve
kubectl config use-context minikube

Les images docker doivent être buildé en local pour minikube.
ex (builder le docker mysite/Dockerfile): docker build -t cryptodraco/wagtail-ql .

Les images doivent être push en prod sur docker registre ou google registry
ex:  gcloud docker -- push gcr.io/fire-193914/frontend

Il y a 3 service:
Redis pour le cache.
Postgres pour la persistance
Frontend le site front

Pour les exposer sur minikube ou gcloud, être dans le bon context d’environnement avec kubectl puis:

En dev
kubectl create -f kubernet_conf/redis.yaml
kubectl create -f kubernet_conf/postgres_minikube.yaml
kubectl create -f kubernet_conf/frontend.yalm

En prod
kubectl create -f kubernet_conf/redis.yaml
kubectl create -f kubernet_conf/postgres_gke.yaml
kubectl create -f kubernet_conf/frontend_prod.yal


Test:
╰─$ kubectl get services                                                                                                                                                                                                    1 ↵
NAME           TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)        AGE
guestbook      LoadBalancer   10.59.242.133   35.189.238.42   80:30985/TCP   22h
kubernetes     ClusterIP      10.59.240.1     <none>          443/TCP        22h
postgres       ClusterIP      10.59.244.51    <none>          5432/TCP       14h
redis-master   ClusterIP      10.59.240.43    <none>          6379/TCP       22h
redis-slave    ClusterIP      10.59.254.122   <none>          6379/TCP       22h
