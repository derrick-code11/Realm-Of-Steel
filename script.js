const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 1024
canvas.height =  576

ctx.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.7

class Sprite{
    constructor({position, velocity, color = 'red', offset}){
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKeyPressed
        this.isAttacking
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color
    }

    draw(){
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

        // attact box
        if(this.isAttacking){
            ctx.fillStyle = 'blue'
            ctx.fillRect(
                this.attackBox.position.x, 
                this.attackBox.position.y, 
                this.attackBox.width,
                this.attackBox.height)
        }

        
    }

    attack(){
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }

    updateScreen(){
        this.draw()

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x 
        this.position.y += this.velocity.y

        // prevents rectangle from falling off the screen
        if (this.position.y + this.velocity.y + this.height >= canvas.height){
            this.velocity.y = 0 
        }
        else{
            this.velocity.y += gravity
        }
    }
}














const player = new Sprite({
    position:{
    x: 0,
    y: 0
},
velocity: {
    x: 0,
    y: 10
},
offset: {
    x: 0,
    y: 0
}
})

const enemy = new Sprite({
    position:{
    x: 400,
    y: 100
},
velocity: {
    x: 0,
    y: 0
},
offset: {
    x: -50,
    y: 0
},
color: 'green'
})


// list of keys for controlling game
const controls = {
    a: {
        isPressed : false
    },
    d: {
        isPressed : false
    },
    w:{
        isPressed : false
    },
    ArrowRight:{
        isPressed : false
    },
    ArrowLeft:{
        isPressed : false
    },
    ArrowUp: {
        isPressed : false
    }


}

// tracks the last key pressed
// let lastKeyPressed;
function characterCollision({char1, char2}){
    return (
        char1.attackBox.position.x + char1.attackBox.width >= char2.position.x &&
        char1.attackBox.position.x <= char2.position.x + char2.width &&
        char1.attackBox.position.y + char1.attackBox.height >= char2.position.y && 
        char1.attackBox.position.y <= char2.position.y + char2.height
        )
}

function animate(){

    window.requestAnimationFrame(animate)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.updateScreen()
    enemy.updateScreen()

    player.velocity.x = enemy.velocity.x = 0
    

    // conditions for accurate player movement
    if (controls.a.isPressed && player.lastKeyPressed === 'a') {
        player.velocity.x = -5
    }
    else if (controls.d.isPressed && player.lastKeyPressed === 'd'){
        player.velocity.x = 5

    }

    // conditions for accurate enemy movement
    if (controls.ArrowLeft.isPressed && enemy.lastKeyPressed === 'ArrowLeft') {
        enemy.velocity.x = -5
    }
    else if (controls.ArrowRight.isPressed && enemy.lastKeyPressed === 'ArrowRight'){
        enemy.velocity.x = 5

    }

    // detecting collision
    if ( characterCollision({char1:player, char2:enemy}) && player.isAttacking
        ){
            player.isAttacking = false
            console.log('go')
        }

    else if ( characterCollision({char1:enemy, char2:player}) && enemy.isAttacking
    ){
        enemy.isAttacking = false
        console.log('attack')
    }
}

animate()

// adding event listeners for keydown events
window.addEventListener('keydown', (e) => {
    switch(e.key){
        case 'd':
            controls.d.isPressed = true
            player.lastKeyPressed = 'd'
            break
        case 'a':
            controls.a.isPressed = true
            player.lastKeyPressed = 'a'
            break
        case 'w':
            player.velocity.y = -20
            break
        case ' ':
            player.attack()
            break
        case 'ArrowRight':
            controls.ArrowRight.isPressed = true
            enemy.lastKeyPressed = 'ArrowRight'
            break
        case 'ArrowLeft':
            controls.ArrowLeft.isPressed = true
            enemy.lastKeyPressed = 'ArrowLeft'
            break
        case 'ArrowUp':
            controls.ArrowUp.isPressed = true
            enemy.velocity.y = -20
            break
        case 'ArrowDown':
            enemy.attack()
            break

    }

})

// adding event listeners for keyup events
window.addEventListener('keyup', (e) => {
    switch(e.key){
        case 'd':
            controls.d.isPressed = false
            break
        case 'a':
            controls.a.isPressed = false
            break
        case 'w':
            controls.w.isPressed = false
            break
        case 'ArrowRight':
            controls.ArrowRight.isPressed = false
            break
        case 'ArrowLeft':
            controls.ArrowLeft.isPressed = false
            break
        case 'ArrowUp':
            controls.ArrowUp.isPressed = false
            break
    }

})

