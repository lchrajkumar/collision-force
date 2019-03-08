import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";
import React from 'react';
import { StyleSheet, Text, View, StatusBar, Dimensions } from 'react-native';
import Box from './Box';


const { width, height } = Dimensions.get("screen");
const boxSize = Math.trunc(Math.max(width, height) * 0.075);
const initialBox = Matter.Bodies.rectangle(width / 2, height / 2, boxSize, boxSize);
const floor = Matter.Bodies.rectangle(width / 2, height - boxSize / 2, width, boxSize, { isStatic: true });
const engine = Matter.Engine.create({ enableSleeping: false });
const world = engine.world;
Matter.World.add(world, [initialBox, floor]);

const Physics = (entities, { time }) => {
    let engine = entities["physics"].engine;
    Matter.Engine.update(engine, time.delta);
    return entities;
};

let boxIds = 0;

const CreateBox = (entities, { touches, screen }) => {
    let world = entities["physics"].world;
    let boxSize = Math.trunc(Math.max(screen.width, screen.height) * 0.075);
    touches.filter(t => t.type === "press").forEach(t => {
            let body = Matter.Bodies.rectangle(
                       t.event.pageX, t.event.pageY, 
                       boxSize, boxSize,
                       { frictionAir: 0.021, 
                          restitution: 1.0    // <--- Added restitution property
                        });
            Matter.World.add(world, [body]);
                entities[++boxIds] = {
                    body: body,
                    size: [boxSize, boxSize],
                    color: boxIds % 2 == 0 ? "pink" : "#B8E986",
                    renderer: Box
                };
             });
    return entities;
};

export default class App extends React.Component {
render() {
   return (
        <GameEngine 
        style={styles.container}systems={[Physics, CreateBox]}
        entities={{ physics: {
          engine: engine,
          world: world
        },

          initialBox: {
          body: initialBox,
          size: [boxSize, boxSize],
          color: 'red',
          renderer: Box
        },
        floor: {
          body: floor,
          size: [width, boxSize],
          color: "green",
          renderer: Box
        }
      }}>
           <StatusBar hidden={true} />
        </GameEngine>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

