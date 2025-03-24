// Wait for the DOM to load completely
document.addEventListener('DOMContentLoaded', function() {
  // Football match setup
  setupFootballMatch();
  
  // Add ambient sounds for stadium atmosphere
  const scene = document.querySelector('a-scene');
  const ambientSound = document.createElement('a-entity');
  ambientSound.setAttribute('sound', {
    src: 'url(https://cdn.aframe.io/basic-guide/audio/backgroundnoise.wav)',
    autoplay: true,
    loop: true,
    volume: 0.5
  });
  scene.appendChild(ambientSound);
  
  // Add day-night cycle - change lighting based on user interaction
  let isDay = true;
  const environment = document.querySelector('[environment]');
  
  // Add a button in VR to toggle day/night
  const toggleButton = document.createElement('a-entity');
  toggleButton.setAttribute('geometry', {
    primitive: 'box',
    width: 0.3,
    height: 0.3,
    depth: 0.1
  });
  toggleButton.setAttribute('material', { color: '#FFD700' });
  toggleButton.setAttribute('position', { x: 1, y: 2, z: 5 });
  toggleButton.setAttribute('class', 'interactive');
  toggleButton.setAttribute('text', {
    value: 'Day/Night',
    align: 'center',
    color: '#000',
    width: 1
  });
  
  toggleButton.addEventListener('click', function() {
    isDay = !isDay;
    if (isDay) {
      environment.setAttribute('environment', {
        preset: 'tron',
        lighting: 'day',
        groundColor: '#267F00'
      });
    } else {
      environment.setAttribute('environment', {
        preset: 'tron', 
        lighting: 'night',
        groundColor: '#1E5631'
      });
    }
  });
  
  scene.appendChild(toggleButton);
  
  // Football interaction - make it kickable
  const football = document.querySelector('#football');
  makeBallKickable(football);
  
  // Add player collision with ball
  setupPlayerBallCollision(football);
  
  // Add reset ball functionality
  const resetBallButton = document.querySelector('#reset-ball');
  resetBallButton.addEventListener('click', function() {
    resetBall(football);
  });
  
  // Add collision detection for goals
  setupGoalDetection(football);
  
  // Helper function to get a random color
  function getRandomColor() {
    const colors = ['#FF0000', '#0000FF', '#FFFF00', '#00FF00', 
                   '#FF6347', '#9370DB', '#20B2AA', '#6495ED'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  // Setup collision detection between player and ball
  function setupPlayerBallCollision(ball) {
    // Create an invisible collision sphere around the player camera
    const playerRig = document.querySelector('#rig');
    const collisionSphere = document.createElement('a-sphere');
    
    collisionSphere.setAttribute('id', 'player-collision');
    collisionSphere.setAttribute('radius', '0.6');
    collisionSphere.setAttribute('position', '0 0 0'); // At camera level instead of feet
    collisionSphere.setAttribute('visible', 'false');
    collisionSphere.setAttribute('class', 'collidable');
    playerRig.appendChild(collisionSphere);
    
    // Add dynamic class to ball to track if it's being kicked by player movement
    ball.setAttribute('class', ball.getAttribute('class') + ' collidable');
    
    // Check for collisions between player and ball
    let lastKickTime = 0;
    const kickCooldown = 500; // milliseconds between possible kicks
    
    // Set up interval to check for collisions
    setInterval(() => {
      const ballPosition = ball.getAttribute('position');
      const playerPosition = playerRig.getAttribute('position');
      
      // Calculate distance between player and ball
      const dx = ballPosition.x - playerPosition.x;
      const dy = ballPosition.y - playerPosition.y;
      const dz = ballPosition.z - playerPosition.z;
      const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
      
      // Check if player is moving (by checking if position changed since last frame)
      if (!playerRig.lastPosition) {
        playerRig.lastPosition = {x: playerPosition.x, y: playerPosition.y, z: playerPosition.z};
      }
      
      const moveX = playerPosition.x - playerRig.lastPosition.x;
      const moveZ = playerPosition.z - playerRig.lastPosition.z;
      const isMoving = Math.abs(moveX) > 0.01 || Math.abs(moveZ) > 0.01;
      
      // Update last position for next check
      playerRig.lastPosition = {x: playerPosition.x, y: playerPosition.y, z: playerPosition.z};
      
      // If player is close to ball and moving, kick the ball
      if (distance < 1.5 && isMoving) {
        const now = Date.now();
        if (now - lastKickTime > kickCooldown) {
          lastKickTime = now;
          
          // Calculate kick direction based on player movement
          const kickDirection = {
            x: moveX * 10, // Amplify the kick force
            y: 0.5,        // Some upward force
            z: moveZ * 10  // Amplify the kick force
          };
          
          // Add some randomness to make it more realistic
          kickDirection.x += (Math.random() - 0.5) * 2;
          kickDirection.z += (Math.random() - 0.5) * 2;
          
          // Apply kick with player movement direction
          kickBall(ball, kickDirection);
          
          // Give visual feedback
          const feedbackText = document.createElement('a-entity');
          feedbackText.setAttribute('position', {x: 0, y: 1, z: -2});
          feedbackText.setAttribute('text', {
            value: 'Kick!',
            align: 'center',
            width: 2,
            color: '#FFFFFF'
          });
          feedbackText.setAttribute('look-at', '[camera]');
          
          // Add to scene temporarily
          scene.appendChild(feedbackText);
          
          // Remove after a short time
          setTimeout(() => {
            if (feedbackText.parentNode) {
              feedbackText.parentNode.removeChild(feedbackText);
            }
          }, 1000);
        }
      }
    }, 100); // Check every 100ms
  }
  
  // Helper function to set up the football match with players
  function setupFootballMatch() {
    const team1Container = document.querySelector('#team-1');
    const team2Container = document.querySelector('#team-2');
    
    // Create team 1 (red team)
    for (let i = 0; i < 11; i++) {
      const player = createTeamPlayer(i, '#ff0000');
      team1Container.appendChild(player);
    }
    
    // Create team 2 (blue team)
    for (let i = 0; i < 11; i++) {
      const player = createTeamPlayer(i, '#0000ff');
      team2Container.appendChild(player);
    }
    
    // Position teams on opposite sides of the field
    team1Container.setAttribute('position', {x: -10, y: 0, z: 0});
    team2Container.setAttribute('position', {x: 10, y: 0, z: 0});
    
    // Add referee
    const referee = document.createElement('a-entity');
    referee.setAttribute('class', 'referee');
    referee.setAttribute('position', {x: 0, y: 0, z: 0});
    
    const refereeBody = document.createElement('a-cylinder');
    refereeBody.setAttribute('height', '1.8');
    refereeBody.setAttribute('radius', '0.3');
    refereeBody.setAttribute('color', '#000000');
    referee.appendChild(refereeBody);
    
    const refereeHead = document.createElement('a-sphere');
    refereeHead.setAttribute('position', {x: 0, y: 1.1, z: 0});
    refereeHead.setAttribute('radius', '0.25');
    refereeHead.setAttribute('color', '#ffdbac');
    referee.appendChild(refereeHead);
    
    document.querySelector('a-scene').appendChild(referee);
    
    // Move referee randomly around the center
    setInterval(() => {
      const currentPos = referee.getAttribute('position');
      const moveX = currentPos.x + (Math.random() * 2 - 1) * 0.5;
      const moveZ = currentPos.z + (Math.random() * 2 - 1) * 0.5;
      
      // Keep referee in the center area of the field
      const constrainedX = Math.min(Math.max(moveX, -5), 5);
      const constrainedZ = Math.min(Math.max(moveZ, -5), 5);
      
      referee.setAttribute('position', {x: constrainedX, y: 0, z: constrainedZ});
      
      // Rotate referee to face a random direction
      const randomRotation = Math.random() * 360;
      referee.setAttribute('rotation', {x: 0, y: randomRotation, z: 0});
    }, 3000);
  }
  
  // Create a player for a team based on position
  function createTeamPlayer(position, teamColor) {
    const player = document.createElement('a-entity');
    player.setAttribute('class', 'player');
    
    // Calculate player position based on formation
    let playerX, playerZ;
    
    if (position === 0) { // Goalkeeper
      playerX = 0;
      playerZ = teamColor === '#ff0000' ? -20 : 20;
    } else if (position <= 4) { // Defenders
      playerX = ((position - 2.5) * 5);
      playerZ = teamColor === '#ff0000' ? -15 : 15;
    } else if (position <= 7) { // Midfielders
      playerX = ((position - 6) * 5);
      playerZ = teamColor === '#ff0000' ? -5 : 5;
    } else { // Forwards
      playerX = ((position - 9.5) * 5);
      playerZ = teamColor === '#ff0000' ? 5 : -5;
    }
    
    player.setAttribute('position', {x: playerX, y: 0, z: playerZ});
    
    // Create player body parts
    const body = document.createElement('a-cylinder');
    body.setAttribute('height', '1.2');
    body.setAttribute('radius', '0.3');
    body.setAttribute('color', teamColor);
    player.appendChild(body);
    
    const head = document.createElement('a-sphere');
    head.setAttribute('position', {x: 0, y: 0.9, z: 0});
    head.setAttribute('radius', '0.25');
    head.setAttribute('color', '#ffdbac');
    player.appendChild(head);
    
    const leftLeg = document.createElement('a-cylinder');
    leftLeg.setAttribute('position', {x: -0.15, y: -0.75, z: 0});
    leftLeg.setAttribute('height', '0.6');
    leftLeg.setAttribute('radius', '0.1');
    leftLeg.setAttribute('color', '#000000');
    player.appendChild(leftLeg);
    
    const rightLeg = document.createElement('a-cylinder');
    rightLeg.setAttribute('position', {x: 0.15, y: -0.75, z: 0});
    rightLeg.setAttribute('height', '0.6');
    rightLeg.setAttribute('radius', '0.1');
    rightLeg.setAttribute('color', '#000000');
    player.appendChild(rightLeg);
    
    // Number on back
    const number = document.createElement('a-text');
    number.setAttribute('value', position + 1);
    number.setAttribute('position', {x: 0, y: 0.2, z: -0.31});
    number.setAttribute('align', 'center');
    number.setAttribute('color', '#FFFFFF');
    number.setAttribute('scale', '0.5 0.5 0.5');
    player.appendChild(number);
    
    // Add random movement for players
    startPlayerMovement(player, playerX, playerZ, teamColor);
    
    // Make players interactive with the ball
    player.addEventListener('click', function() {
      // Get the ball
      const ball = document.querySelector('#football');
      if (ball) {
        // Kick the ball from the player's position
        const playerPos = this.getAttribute('position');
        const ballPos = ball.getAttribute('position');
        
        // Calculate direction from player to ball
        const direction = {
          x: ballPos.x - playerPos.x,
          y: 0.5,
          z: ballPos.z - playerPos.z
        };
        
        // Normalize and scale
        const length = Math.sqrt(direction.x * direction.x + direction.z * direction.z);
        const kickPower = 4;
        direction.x = (direction.x / length) * kickPower;
        direction.z = (direction.z / length) * kickPower;
        
        // Apply kick
        kickBall(ball, direction);
      }
    });
    
    return player;
  }
  
  // Make players move randomly within their zone
  function startPlayerMovement(player, baseX, baseZ, teamColor) {
    const isTeam1 = teamColor === '#ff0000';
    const movementRadius = 3; // How far they can move from their base position
    
    setInterval(() => {
      const randomX = baseX + (Math.random() * movementRadius * 2) - movementRadius;
      const randomZ = baseZ + (Math.random() * movementRadius * 2) - movementRadius;
      
      // Ensure players stay on their side of the field
      const constrainedZ = isTeam1 ? 
        Math.min(Math.max(randomZ, -24), 0) : 
        Math.min(Math.max(randomZ, 0), 24);
      
      // Ensure players stay within field width
      const constrainedX = Math.min(Math.max(randomX, -14), 14);
      
      player.setAttribute('animation', {
        property: 'position',
        to: {x: constrainedX, y: 0, z: constrainedZ},
        dur: 2000,
        easing: 'easeInOutQuad'
      });
      
      // Rotate player to face movement direction
      const currentPos = player.getAttribute('position');
      const angleRad = Math.atan2(constrainedZ - currentPos.z, constrainedX - currentPos.x);
      const angleDeg = (angleRad * 180 / Math.PI) - 90;
      
      player.setAttribute('animation__rotate', {
        property: 'rotation',
        to: {x: 0, y: angleDeg, z: 0},
        dur: 500,
        easing: 'easeOutQuad'
      });
    }, 3000 + Math.random() * 2000); // Random interval between 3-5 seconds
  }
  
  // Make the ball kickable
  function makeBallKickable(ball) {
    // Add click and hover interactivity
    ball.addEventListener('mouseenter', function() {
      const cursor = document.querySelector('a-cursor');
      if (cursor) cursor.setAttribute('color', '#FF0000');
    });
    
    ball.addEventListener('mouseleave', function() {
      const cursor = document.querySelector('a-cursor');
      if (cursor) cursor.setAttribute('color', '#FFFFFF');
    });
    
    ball.addEventListener('click', function(evt) {
      // Get direction from camera to ball
      const camera = document.querySelector('a-camera');
      const cameraPosition = camera.getAttribute('position');
      const ballPosition = this.getAttribute('position');
      
      // Calculate direction vector
      const direction = {
        x: ballPosition.x - cameraPosition.x,
        y: 0.5, // Always add some upward force
        z: ballPosition.z - cameraPosition.z
      };
      
      // Normalize and scale
      const length = Math.sqrt(direction.x * direction.x + direction.z * direction.z);
      const kickPower = 5;
      direction.x = (direction.x / length) * kickPower;
      direction.z = (direction.z / length) * kickPower;
      
      // Apply kick
      kickBall(this, direction);
    });
  }
  
  // Helper function to kick the ball
  function kickBall(ball, direction) {
    // Apply impulse using physics system if available
    try {
      if (ball.body) {
        const impulse = new CANNON.Vec3(direction.x, direction.y, direction.z);
        const worldPoint = new CANNON.Vec3().copy(ball.getAttribute('position'));
        ball.body.applyImpulse(impulse, worldPoint);
      }
    } catch (error) {
      console.warn("Physics interaction error:", error);
      
      // Fallback for when physics aren't working
      const ballPosition = ball.getAttribute('position');
      ball.setAttribute('animation', {
        property: 'position',
        to: {
          x: ballPosition.x + direction.x * 2,
          y: ballPosition.y + 1,
          z: ballPosition.z + direction.z * 2
        },
        dur: 1000,
        easing: 'easeOutQuad'
      });
    }
    
    // Add sound effect
    const kickSound = document.createElement('a-sound');
    kickSound.setAttribute('src', 'url(https://cdn.aframe.io/basic-guide/audio/click.ogg)');
    kickSound.setAttribute('autoplay', 'true');
    ball.appendChild(kickSound);
    
    // Remove the sound element after it plays
    setTimeout(() => {
      if (kickSound.parentNode === ball) {
        ball.removeChild(kickSound);
      }
    }, 1000);
  }
  
  // Helper function to reset the ball
  function resetBall(ball) {
    // Reset position
    ball.setAttribute('position', {x: 0, y: 1.2, z: 6});
    
    // Reset velocity
    try {
      if (ball.body) {
        ball.body.velocity.set(0, 0, 0);
        ball.body.angularVelocity.set(0, 0, 0);
      }
    } catch (error) {
      console.warn("Physics reset error:", error);
    }
    
    // Add reset effect
    const resetEffect = document.createElement('a-animation');
    resetEffect.setAttribute('attribute', 'scale');
    resetEffect.setAttribute('from', '0.5 0.5 0.5');
    resetEffect.setAttribute('to', '1 1 1');
    resetEffect.setAttribute('dur', '500');
    ball.appendChild(resetEffect);
    
    // Remove the animation element after it completes
    setTimeout(() => {
      if (resetEffect.parentNode === ball) {
        ball.removeChild(resetEffect);
      }
    }, 500);
    
    // Show reset message
    const message = document.createElement('a-entity');
    message.setAttribute('position', {x: 0, y: 2, z: 0});
    message.setAttribute('text', {
      value: 'Ball Reset!',
      align: 'center',
      width: 5,
      color: '#FFFFFF'
    });
    document.querySelector('a-scene').appendChild(message);
    
    // Remove message after a few seconds
    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    }, 1500);
  }
  
  // Set up goal detection
  function setupGoalDetection(ball) {
    // Create goal zones
    const goal1Zone = document.createElement('a-box');
    goal1Zone.setAttribute('class', 'goal-zone');
    goal1Zone.setAttribute('position', {x: 0, y: 1, z: -25});
    goal1Zone.setAttribute('width', 7);
    goal1Zone.setAttribute('height', 2);
    goal1Zone.setAttribute('depth', 2);
    goal1Zone.setAttribute('visible', false);
    goal1Zone.setAttribute('data-team', 'team2'); // Team that scores when ball enters
    
    const goal2Zone = document.createElement('a-box');
    goal2Zone.setAttribute('class', 'goal-zone');
    goal2Zone.setAttribute('position', {x: 0, y: 1, z: 25});
    goal2Zone.setAttribute('width', 7);
    goal2Zone.setAttribute('height', 2);
    goal2Zone.setAttribute('depth', 2);
    goal2Zone.setAttribute('visible', false);
    goal2Zone.setAttribute('data-team', 'team1'); // Team that scores when ball enters
    
    document.querySelector('a-scene').appendChild(goal1Zone);
    document.querySelector('a-scene').appendChild(goal2Zone);
    
    // Check for goals using interval
    setInterval(() => {
      const ballPosition = ball.getAttribute('position');
      
      // Check goal 1
      const goal1Position = goal1Zone.getAttribute('position');
      if (Math.abs(ballPosition.x - goal1Position.x) < 3.5 && 
          Math.abs(ballPosition.y - goal1Position.y) < 1 && 
          Math.abs(ballPosition.z - goal1Position.z) < 1) {
        goalScored('team2');
        resetBall(ball);
      }
      
      // Check goal 2
      const goal2Position = goal2Zone.getAttribute('position');
      if (Math.abs(ballPosition.x - goal2Position.x) < 3.5 && 
          Math.abs(ballPosition.y - goal2Position.y) < 1 && 
          Math.abs(ballPosition.z - goal2Position.z) < 1) {
        goalScored('team1');
        resetBall(ball);
      }
    }, 500); // Check every half second
  }
  
  // Handle goal scoring
  function goalScored(team) {
    // Create goal message
    const message = document.createElement('a-entity');
    message.setAttribute('position', {x: 0, y: 3, z: 0});
    message.setAttribute('text', {
      value: 'GOAL! ' + (team === 'team1' ? 'Red' : 'Blue') + ' Team Scores!',
      align: 'center',
      width: 10,
      color: team === 'team1' ? '#FF0000' : '#0000FF'
    });
    
    // Add animation to the message
    message.setAttribute('animation', {
      property: 'position.y',
      from: 3,
      to: 5,
      dur: 2000,
      easing: 'easeOutQuad'
    });
    
    // Add second animation for fading out
    message.setAttribute('animation__fade', {
      property: 'text.opacity',
      from: 1,
      to: 0,
      dur: 2000,
      easing: 'easeInQuad'
    });
    
    document.querySelector('a-scene').appendChild(message);
    
    // Play crowd cheer sound
    const cheerSound = document.createElement('a-sound');
    cheerSound.setAttribute('src', 'url(https://cdn.aframe.io/basic-guide/audio/backgroundnoise.wav)');
    cheerSound.setAttribute('autoplay', 'true');
    cheerSound.setAttribute('volume', '3');
    document.querySelector('a-scene').appendChild(cheerSound);
    
    // Remove message and sound after animation completes
    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
      if (cheerSound.parentNode) {
        cheerSound.parentNode.removeChild(cheerSound);
      }
    }, 2000);
  }
}); 