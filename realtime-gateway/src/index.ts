/**
 * Papel do gateway: receber do tópico kafka e validar se algum usuário da mensagem está dentro da lista interna
 * Se estiver dentro da lista, enviar mensagem
 * Se nenhum estiver, ignorar
 */

import 'dotenv/config';
import { ConsumersRunner } from './consumers';
import { createKafka } from './lib/kafka';
import { createSocketServer } from './socket/server';
import { ConnectedUsers } from './sessions/connected-users';

const port = Number(process.env.PORT ?? 3000);

const users = new ConnectedUsers();
const { httpServer, io } = createSocketServer(users);

console.log("Starting WebSocket server...");
httpServer.listen(port, () =>
  console.log(`WebSocket server listening on port ${port}`)
);

const consumersRunner = new ConsumersRunner(createKafka(), io, users);
consumersRunner.run();