
[pod-lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/)  


- Pod Phase
    - Pending
    - Running
    - Succeeded
    - Failed
    - Unknown

실습
```console
$ kubectl get pods -o wide --watch
NAME        READY   STATUS    RESTARTS   AGE   IP       NODE     NOMINATED NODE   READINESS GATES
# kubectl create -f pod-nginx.yaml
nginx-pod   0/1     Pending   0          0s    <none>   <none>   <none>           <none>
nginx-pod   0/1     Pending   0          0s    <none>   jeukoh-m03   <none>           <none>
nginx-pod   0/1     ContainerCreating   0          0s    <none>   jeukoh-m03   <none>           <none>
nginx-pod   1/1     Running             0          2s    172.17.0.2   jeukoh-m03   <none>           <none>
# kubectl delete pod nginx-pod
nginx-pod   1/1     Terminating         0          40s   172.17.0.2   jeukoh-m03   <none>           <none>
nginx-pod   0/1     Terminating         0          41s   172.17.0.2   jeukoh-m03   <none>           <none>
nginx-pod   0/1     Terminating         0          41s   172.17.0.2   jeukoh-m03   <none>           <none>
nginx-pod   0/1     Terminating         0          41s   172.17.0.2   jeukoh-m03   <none>           <none>
```
---

redis123 이미지를 쓰는 redis pod 생성시
```

$ kubectl run redis --image=redis123 --dry-run=client -o yaml > redis.yaml
$ kubectl create -f redis.yaml

# 오류 확인
$ kubectl describe pods redis

Normal   Scheduled  75s                default-scheduler  Successfully assigned default/redis to jeukoh-m02
  Normal   Pulling    33s (x3 over 76s)  kubelet            Pulling image "redis123"
  Warning  Failed     31s (x3 over 73s)  kubelet            Failed to pull image "redis123": rpc error: code = Unknown desc = Error response from daemon: pull access denied for redis123, repository does not exist or may require 'docker login': denied: requested access to the resource is denied
  Warning  Failed     31s (x3 over 73s)  kubelet            Error: ErrImagePull
  Normal   BackOff    18s (x3 over 72s)  kubelet            Back-off pulling image "redis123"
  Warning  Failed     18s (x3 over 72s)  kubelet            Error: ImagePullBackOff

# image 올바르게 수정
$ kubectl edit pods redis

spec:
  containers:
  - image: redis123 -> redis
    imagePullPolicy: Always
    name: redis

# 저장 후 다시 describe 시

  Normal   Pulling    13s                kubelet            Pulling image "redis"
  Normal   Pulled     4s                 kubelet            Successfully pulled image "redis" in 9.639412523s
  Normal   Created    4s                 kubelet            Created container redis
  Normal   Started    4s                 kubelet            Started container redis

