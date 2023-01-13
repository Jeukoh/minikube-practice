## Minikube 설치

```bash
$ curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
$ sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

---

## Minikube Cluster 설정

```bash
# cluster 구성
$ minikube start --memory NUM_MEMORY --cpus NUM_CPU -p USERNAME
# 노드 추가
$ minikube node add -p USERNAME
```

---

## 자동완성 설정

```bash
$ echo "soruce <(minikube completion zsh)" >>  ~/.zshrc    
$ echo "source <(kubectl completion zsh)" >> ./.zshrc 
```

---

## Dashboard 띄워 놓기

```bash
$ minikube dashboard -p USERNAME &
```