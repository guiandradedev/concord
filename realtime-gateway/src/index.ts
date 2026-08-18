/**
 * Papel do gateway: receber do tópico kafka e validar se algum usuário da mensagem está dentro da lista interna
 * Se estiver dentro da lista, enviar mensagem
 * Se nenhum estiver, ignorar
 */

import 'dotenv/config';
import { ConsumersRunner } from './consumers';

import './socket/server';

const consumersRunner = new ConsumersRunner();
consumersRunner.run();