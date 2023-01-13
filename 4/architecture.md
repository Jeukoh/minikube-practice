## 쿠베네티스 컨테이너 동작 Flow

1. docker push hub.example.com/nginx
    Docker image 만든 뒤 Docker hub에 push

2. kubectl create deploy web --image=hub.example.com/nginx
    kubectl을 통해 web이라는 이름을 가진 deploy를 생성해달라 요청.
    ```
    Examples:
    # Create a deployment named my-dep that runs the busybox image
    kubectl create deployment my-dep --image=busybox
    ```
    `master node (control-plane node)` 내 REST API Server가 요청을 받아 Scheduler을 통해 어떤 worker node를 쓸지 결정. 해당 worker node에 있는 `kubelet`에게 요청을 전달. 
    worker node의 `kubelet`은 node의 docker engine에게 nginx container를 띄우도록 명령. hub.example.com에 nginx image를 search하고 container (`pod`)로 실행.

## 쿠버네티스 컴포넌트
1. 마스터 컴포넌트 (control plane)
    - etcd : key-value 형태로 상태 정보 ( worker node, pod, H/W, 등등 )  저장
    - kube-apiserver : kubectl 명령어를 통해 온 요청을 처리해주는 컴포넌트. worker node에 명령을 전달.
    - kube-scheduler : etcd의 상태 정보를 기반으로 api 요청을 처리할 worker node를 결정.
    - kube-controller : ToBe 상태와 AsIs 상태가 일치하지 않을 시 API server에 재요청. (파드의 개수를 보장)
    - 기타 : 
        - CNI : 네트워크 애드온 
        - coreDNS : DNS 애드온
        - dashboard
        - cluster logging
2. 워커 노드 컴포넌트
    - kubelet : k8s 에이전트, container 모니터링 (cAdvisor). 데몬 (background 상주) 형태로 동작. 
    - kube-proxy : Network 담당
    - docker : container runtime 엔진

## k8s namespace
- 클러스터 하나를 여러 개의 논리적 단위로 나눠서 사용
- Cluster 하나를 여러 사용자가 사용할 때, 마치 여러 개의 cluster가 있는 것처럼 분리.
- `kubectl create namespace my-namespace`
- `kubectl create deploy ui --image=nginx --namespace my-namespace`
```bash
$ kubectl get pods -n default 
NAME        READY   STATUS    RESTARTS   AGE
webserver   1/1     Running   0          53m

$ kubectl get pods -n kube-system 
NAME                             READY   STATUS    RESTARTS      AGE
coredns-565d847f94-bsld6         1/1     Running   3 (46h ago)   47h
etcd-jeukoh                      1/1     Running   4 (46h ago)   47h
kindnet-2wgn6                    1/1     Running   0             46h
kindnet-7nrmf                    1/1     Running   0             46h
kindnet-fmsx9                    1/1     Running   0             46h
kube-apiserver-jeukoh            1/1     Running   3 (46h ago)   47h
kube-controller-manager-jeukoh   1/1     Running   3 (46h ago)   47h
kube-proxy-bx852                 1/1     Running   4 (46h ago)   47h
kube-proxy-pqpqj                 1/1     Running   0             46h
kube-proxy-vkkd7                 1/1     Running   0             46h
kube-scheduler-jeukoh            1/1     Running   4 (46h ago)   47h
storage-provisioner              1/1     Running   6 (46h ago)   47h
```


### Namespace yaml 생성

```bash
$ kubectl create namespace orange --dry-run -o yaml
apiVersion: v1
kind: Namespace
metadata:
  creationTimestamp: null
  name: orange
spec: {}
status: {}
```
--dry-run은 실제 실행을 하지 않고, 실행 가능한지 확인하기 위한 argument. 
yaml 파일을 만드는 용도로도 사용.

```bash
$ kubectl create -f orange-ns.yaml 
namespace/orange created
```

### pod.yaml에 Namespace 적기.

pod.yaml의 metadata, namespace 값을 통해 -namepsace 인자 없이도 namespace 설정 가능. 예제인 nginx.yaml 파일 확인.
```bash
$ kubectl create -f nginx.yaml 
pod/mypod created
$ kubectl get pods -n orange 
NAME    READY   STATUS              RESTARTS   AGE
mypod   0/1     ContainerCreating   0          7s
```

### Base NameSpace 설정
```
# context 확인
$ kubectl config view

...
contexts:
- context:
    cluster: kubernetes
    namespace: blue
    user: kubernetes-admin
  name: blue@kubernetes
- context:
    cluster: jeukoh
    extensions:
    - extension:
        last-update: Wed, 11 Jan 2023 17:12:48 KST
        provider: minikube.sigs.k8s.io
        version: v1.28.0
      name: context_info
    namespace: default
    user: jeukoh
  name: jeukoh


# context 설정
$ kubectl config set-context blue@kubernetes --cluster=kubernetes --user=kubernetes-admin --namespace=blue
Context "blue@kubernetes" created.

# 현재 context 확인
$ kubectl config current-context
```

Minikube에서는 extensions이 없어서 그런가 해당 방법으론 blue로 context switch 시 문제가 있음. 추후 다른 방법 추가.