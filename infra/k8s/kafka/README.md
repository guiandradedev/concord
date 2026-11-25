# Kafka

## Por que usar StatefulSet?

Um StatefulSet executa um grupo de pods com identidade fixa para cada um deles, sendo útil para gerir aplicações que precisam de armazenamento persistente ou uma identidade de rede estável e única. Como um Deployment, ele também gerencia os Pods com base na spec do container, mas com a diferença de que cada Pod possui um identificar persistnete que é mantido mesmo após qualquer reprogramação.
O Kafka foi desenhado como um sistema stateful com requisitos especificos sobre estabilidade de rede e persistência de armazenamento que não se alinham com a natureza do Kubernetes. Em especial o maior problema é o armazenamento, em que brokers Kafka demandam volume persistente que sobrevivam ao reinicio e reagendamento de Pods. Neste cenário surge os Persistent Volume Claims (PVCs), que permitem essa capacidade, mas que entregam complexidade na definićão das classes de armazenamento com performance de I/O suficiente.
Como resultado, os StatefulSets são úteis para aplicações que precisam de armazenamento persistente, como bancos de dados e sistemas de mensagens, como o Kafka.
A versão implementada aqui não é a ideal. Para um aplicativo produtivo, uma opção melhor é o **Strimzi**.

## Limitações do StatefulSet

- O armazenamento deve ser feito por um PersistentVolume ou provisionado por um administrador do cluster
- Deletar e/ou escalar um StatefulSet para baixo não deleta os volumes associados ao StatefulSet
- Os StatefulSets requerem um serviço Headless para ser responsável pela identidade de rede dos Pods
  - Serviços Headless não possuem um endereço IP, mas permitem que os clientes se conectem diretamente aos Pods
- StatefulSets não fornecem garantias sobre a terminação dos pods quando um StatefulSet é deletado

## Referências

https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/
https://dev.to/giveitatry/deploying-apache-kafka-4x-on-kubernetes-with-kraft-sasl-and-high-availability-3m0k
https://www.confluent.io/learn/kafka-on-kubernetes/
https://md-imran-sheikh.medium.com/deploy-apache-kafka-on-kubernetes-a-complete-guide-81ba81ab445f
https://dzone.com/articles/how-to-deploy-apache-kafka-with-kubernetes