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

# pod-nginx.yaml 사용
