## Container

예제로, 요청을 받으면 hello world를 리턴하는 어플리케이션을 배포하려는 상황.  
소스 코드는 [app.js](app.js)에 있음.

[Dockerfile](Dockerfile)에서 소스 코드를 실행하는 환경 (컨테이너)를 구성

Test

```console
 $ docker build -t jeukoh/testapp
 $ docker run -p 8080:8081 -d jeukoh/testapp:latest

 server is running

 $ curl localhost:8080
 Hello world% 
 ```
동작 확인.

이미지를 빌드한 뒤 image repo (docker hub 등)에 push


추후 Docker 엔진이 존재하는 리눅스 시스템에서 image repo에서 이미지를 풀 한 뒤 어플리케이션을 컨테이너로 실행

---

## Pod
- 컨테이너를 표현하는 K8S API의 최소 단위
- Pod에는 여러개의 컨테이너가 포함될 수 있음.

### PoD 생성
1. CLI로 생성  
   $ kubectl run webserver --image=nginx:1.14
   nginx container를 포함하는 webserver란 이름의 pod를 실행
2. pod yaml 방식


- Handson  
멀티 노드 환경.
```console
# cli 생성
kubectl run web1 --image=nginx:1.14 --port 80

# [pod-nginx.yaml](pod-nginx.yaml) 사용
kubectl create -f pod-nginx.yaml
```

---

pods 상태 모니터링
`$ watch kubectl get pods -o wide`

minikube의 경우 cluster 외부에서 통신하기 때문에, expose를 하여 service를 생성해야함.  
`$ kubectl expose pod web1 --type=NodePort --port=8080`  
또는 `$ minikube -p PROFILE ssh` 로 master node에 ssh로 연결한 뒤 
pod의 내부 ip 사용 가능.


---

## multi-container Pod 생성하기
[pod-multi.yaml](pod-multi.yaml) 사용
```console

$ kubectl create -f pod-multi.yaml

# CentOs container bash 들어가기.
$ kubectl exec multipod -c centos-container -it -- /bin/bash 

# ps 시 No nginx
# 근데 localhost로 curl 보낼 시 nginx 응답이 옴.
[root@multipod /]# curl http://localhost:80
TEST Web
```

컨테이너 nginx와 centos-container가 같은 pod내에서 같은 ip를 공유하여 localhost로 요청 가능. 

`kubectl logs multipod -c nginx-container` log 보기.
 