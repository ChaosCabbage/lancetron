'use strict';

import GameEngine from 'lance/GameEngine';
import SimplePhysicsEngine from 'lance/physics/SimplePhysicsEngine';
import PlayerAvatar from './PlayerAvatar';

export default class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({ gameEngine: this });
    }

    registerClasses(serializer) {
        serializer.registerClass(PlayerAvatar);
    }

    start() {

        super.start();

        this.worldSettings = {
            width: 15,
            height: 15
        };

        this.on('playerJoined', player => {
            console.log("onPlayerJoined(", player, ")")
            const p = new PlayerAvatar(this);
            p.playerId = player.playerId;
            p.position.x = 3.5
            p.position.y = 3.5
            p.velocity.x = 0.02
            this.addObjectToWorld(p)
        })

        this.on('postStep', () => {})

    }

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        // get the player's primary object
        let player = this.world.queryObject({});
        if (player) {
            console.log(`player ${playerId} pressed ${inputData.input}`);
            if (inputData.input === 'up') {
                player.isMovingUp = true;
            } else if (inputData.input === 'down') {
                player.isMovingDown = true;
            } else if (inputData.input === 'right') {
                player.isRotatingRight = true;
            } else if (inputData.input === 'left') {
                player.isRotatingLeft = true;
            }
        }
    }
}
