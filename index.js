const seedrandom = require("seedrandom");
Math.random = seedrandom("testing");

const lodash = require("lodash");

class Node {
    constructor(opts) {
        this.judgements = {};
        this.name = opts.name;
        this.positivity = opts.positivity;
        this.pettiness = opts.pettiness;
        this._leader = false;
    }

    generateGossip(clique) {
        let positive;
        let targetName;
        const numTargets = Math.floor(Object.keys(this.judgements).length / 3) || 1;

        positive = !!(Math.random() < this.positivity);

        if (positive) {
            targetName = lodash(this.judgements)
                  .toPairs()
                  .sortBy(1)
                  .reverse()
                  .take(numTargets)
                  .sample()[0];
        } else {
            if (Math.random() < this.pettiness) {
                targetName = lodash(this.judgements)
                    .toPairs()
                    .sample()[0];
            } else {
                targetName = lodash(this.judgements)
                    .toPairs()
                    .sortBy(1)
                    .take(numTargets)
                    .sample()[0];
            }
        }
        this.spreadGossip(clique, targetName, positive);
    }

    spreadGossip(clique, targetName, positive) {
        const score = positive ? 1 : -1;
        console.log(`${this.name}: spreading ${positive ? "positive" : "negative"} gossip about ${targetName}`);
        this.judgements[targetName] += score;
        for (const k in clique.nodes) {
            const n = clique.nodes[k];
            if (!positive && n.name === targetName && Math.random() > 0.2) {
                continue;
            } else if (n.name === this.name) {
                continue;
            }

            n.receiveGossip(this, targetName, score);
        }
    }

    receiveGossip(origin, targetName, score) {
        console.log(`${this.name}: handling gossip about ${targetName}`);
        const originScore = this.judgements[origin.name];
        const targetScore = this.judgements[targetName];
        if (targetName === this.name) {
            this.judgements[origin.name] += score;
        } else if (score > 0) {
            this.judgements[targetName] += score;
        } else if (originScore > targetScore) {
            this.judgements[targetName] += score;
        } else {
            this.judgements[origin.name] += score;
        }
    }
}

class Clique {
    constructor() {
        this.nodes = {};
        this.leader = null;
    }

    addNode(node) {
        if (Object.keys(this.nodes).length === 0) {
            node._leader = true;
            this.leader = null;
        }
        this.nodes[node.name] = node;
        this._updateJudgements(node);
    }

    _updateJudgements(node) {
        for (const k in this.nodes) {
            const nn = this.nodes[k];
            if (nn.name === node.name) {
                continue;
            }

            node.judgements[nn.name] = 0;
            nn.judgements[node.name] = 0;

            if (nn._leader) {
                node.judgements[nn.name] += 5;
            }
        }
    }
}

function generateNodes(n) {
    return lodash.range(n).map((i) => {
        return new Node({
            name: `n${i}`,
            positivity: Math.random(),
            pettiness: Math.random()
        });
    });
}

function logJudgements(nodes) {
    for (const n of nodes) {
        console.log(n.name, n.judgements, n._leader);
    }
    console.log();
}

const nodes = generateNodes(7);
const c = new Clique();
nodes.forEach(c.addNode.bind(c));

logJudgements(nodes);

lodash.sample(nodes).generateGossip(c);

logJudgements(nodes);

lodash.sample(nodes).generateGossip(c);

logJudgements(nodes);
lodash.sample(nodes).generateGossip(c);

logJudgements(nodes);
lodash.sample(nodes).generateGossip(c);

logJudgements(nodes);

lodash.sample(nodes).generateGossip(c);

logJudgements(nodes);

lodash.sample(nodes).generateGossip(c);

logJudgements(nodes);
lodash.sample(nodes).generateGossip(c);

logJudgements(nodes);
lodash.sample(nodes).generateGossip(c);

logJudgements(nodes);
