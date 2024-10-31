"use strict";
import { cameraMove, oneTimeControl, keyStates, throttle } from "./helper.js";
// import { dat } from "./games_fps.copy.js"
console.log("running");

// alert("hi")
class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }


}
class Rect {
    constructor(x1 = 0, y1 = 0, x2 = 0, y2 = 0) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    start() {
        return [this.x1, this.y1]
    }
    end() {
        return [this.x2, this.y2]
    }
    as2Dmatrix() {
        return [this.start, this.end]
    }
    width() {
        return Math.abs(this.x1 - this.x2);
    }
    height() {
        return Math.abs(this.y1 - this.y2);
    }
    area() {
        return this.width() * this.height();
    }
    corners() {
        return [
            new Vector2D(this.x1, this.y1),
            new Vector2D(this.x1, this.y2),
            new Vector2D(this.x2, this.y1),
            new Vector2D(this.x2, this.y2),
        ]
    }
    isPointInside(vector2d) {
        return (
            (this.x1 < vector2d.x && vector2d.x < this.x2)
            && (this.y1 < vector2d.y && vector2d.y < this.y2)
        )
    }

    isanyCornarsInside(compRect) {
        for (let cornar of compRect.corners()) {
            console.log(cornar, this)
            if (this.isPointInside(cornar))
                return true;
        }
        return false;
    }
    isCornarsOverlap(compRect) {
        return this.area() < compRect.area() ?
            compRect.isanyCornarsInside(this) :
            this.isanyCornarsInside(compRect);
    }


}
// {
//  test
//     window.a1 = new Rect(10, 10, 20, 20);
//     window.a2 = new Rect(15, 15, 25, 25);
//     console.log("Ovarlap : ", a1.isCornarsOverlap(a2));

// }



let mainUIdiv = document.createElement("div", {})
mainUIdiv.id = "UIdiv"
// todo how to css with js
// let stjson = JSON.stringify({
//     background: 'wheat',
//     height: '100%',
//     width: '100%',
//     position: 'fixed',
//     opacity: '0.4'
// })
// mainUIdiv.style.cssText = stjson
// mainUIdiv.style.cssText = "background: wheat; height: 100%; width: 100%; position: fixed; opacity: 0.4;"

let UI = {}
let joystickDiv = document.createElement("div");
joystickDiv.classList.add("joystickDiv");
joystickDiv.classList.add("controlDiv");
joystickDiv.id = "joystickDiv";

let cameraMoveDiv = document.createElement("div");
cameraMoveDiv.classList.add("cameraMoveDiv");
cameraMoveDiv.classList.add("controlDiv");
cameraMoveDiv.id = "cameraMoveDiv";

let otherControlsDiv = document.createElement("div");
otherControlsDiv.classList.add("otherControlsDiv");
otherControlsDiv.classList.add("controlDiv");
otherControlsDiv.id = "otherControlsDiv";



export const UIbtnNames = [
    "joystick_f",
    "joystick_r",
    "joystick_l",
    "joystick_b",
    // "camera_f",
    // "camera_r",
    // "camera_l",
    // "camera_b",
    "shoot",
    "jump",
];
UI.buttons = UIbtnNames.map(element => {
    let btn = document.createElement("button");
    // todo add styleing  to btns
    btn.classList.add(element, "UIbtn");
    btn.id = "UI" + element + "Btn";
    btn.value = element;
    // btn.innerText = element;
    btn.dataset.func = element;
    function addEventListeners(element, elementName) {
        ["touchstart.0", "touchcancel.1", "touchend.1", "mousedown.0", "mouseup.1"].forEach(eventType => {
            element.addEventListener(eventType.split(".")[0], integretion(!(+eventType.split(".")[1])));
        });
    }
    addEventListeners(btn, btn.value);
    // mainUIdiv.appendChild(btn)
    // UI.buttons[element] = btn;
    if (btn.id.includes("joystick"))
        joystickDiv.appendChild(btn)
    else if (btn.id.includes("camera"))
        cameraMoveDiv.appendChild(btn)
    else
        otherControlsDiv.appendChild(btn);

    function integretion(setTO) {
        return event => {
            console.log(event)
            if (!event.repeat && setTO && event.type.includes("down")) oneTimeControl({ code: element });
            console.log(event.target);
            // cancele bouble or stop propagation
            keyStates[element] = setTO;
            event.stopPropagation();
            console.log(keyStates);
        };
    }
    return btn;
});



mainUIdiv.append(joystickDiv, cameraMoveDiv, otherControlsDiv)
document.getElementById("container").append(mainUIdiv)
window.addEventListener("DOMContentLoaded", F)
function F() {
    let inf = {};
    inf.control = {};
    inf.control.cameraMove = {}
    // (function(camcontrol){
    //     camcontrol.startX =  screen.availWidth / 2;
    //     camcontrol.endX =  screen.availWidth ;
    //     camcontrol.startY = 0;
    //     camcontrol.startY = screen.availHeight;
    // })(inf.control.cameraMove);
    inf.control.cameraMove = () => [
        [
            screen.availWidth / 2,
            0
        ], [
            screen.availWidth,
            screen.availHeight
        ],
    ];
    inf.screenAreaBooked = {}

    inf.screenAreaBooked.cameraMove = [];
    inf.screenAreaBooked.cameraMove += [new Rect(
        inf.control.cameraMove()[0][0],
        inf.control.cameraMove()[0][1],
        inf.control.cameraMove()[1][0],
        inf.control.cameraMove()[1][1]
    )]
    let tmp = [];
    // todo check on mobile device is that working or not
    // mainUIdiv.addEventListener("touchmove", touchm)

    mainUIdiv.addEventListener("touchmove", throttle(touchm, 100));

    function touchm(event) {
        // todo seperate controll wise calculations
        // todo set deactivate touch area where buttons are presents or expected to deactivete
        // . TT
        let movement, startFrom, movementEvent;
        let touch = detectMovement(event);
        if (touch) {
            ({ movement, startFrom, event: movementEvent } = touch);
        }
        console.log(touch)
        if (touch) {
            console.log(movement)
            inf.sensitivity = 20
            console.log(movement)
            console.log(movement.x, movement.y)
            if (screenAreaBookedByPoint(startFrom) == "cameraMove")
                cameraMove(movement.x * inf.sensitivity, movement.y * inf.sensitivity)
        }
        event.stopPropagation()
    }
    function screenAreaBookedByPoint(vector2d) {
        for (let capturedBy in inf.screenAreaBooked)
            for (const rect of inf.screenAreaBooked[capturedBy]) {
                if (rect.isPointInside(vector2d)) {
                    return capturedBy;
                }
            }
    }
    inf.deltatime = (1000 / 60) / dat.STEPS_PER_FRAME
    let previousMove = {};
    function touchDetection(event, key) {
        // only work first time
        if (!previousMove[key]) {
            previousMove[key] = event;
            console.info("1")
            return false;
        }
        let diff = event.timeStamp - previousMove[key].timeStamp;
        if (
            (diff > inf.deltatime * 10)
        ) {
            console.info("2")
            previousMove[key] = event;
            return false;
        }
        if ((diff <= inf.deltatime * 10)
            && (diff >= inf.deltatime)) {
            console.info("3")
            console.log(event, previousMove[key])
            let movement = new Vector2D(
                event.touches[0].screenX - previousMove[key].touches[0].screenX,
                event.touches[0].screenY - previousMove[key].touches[0].screenY,

            );
            let startFrom = new Vector2D(
                previousMove[key].touches[0].screenX,
                previousMove[key].touches[0].screenY
            );

            previousMove[key] = event;
            // return movement;
            return {
                "movement": movement,
                "startFrom": startFrom,
                "event": event
            }
        }
        return dat.tmp.push([key, diff, inf.deltatime * dat.STEPS_PER_FRAME])

    }
    function detectMovement(event) {
        // checks previous touch hppeds and thats before 10 times delta time finishes 
        // if not then add this event to lastevent variable
        // console.log(event)
        if (previousMove["last"]) {
            if (previousMove["last"].timeStamp
                - event.timeStamp >
                inf.deltatime * 10 * dat.STEPS_PER_FRAME) {
                previousMove["last"] = event;
                return false;
            }
        } else {
            previousMove["last"] = event;
            return false;

        }


        switch (screenAreaBookedByPoint(new Vector2D(
            event.touches[0].screenX,
            event.touches[0].screenY
        ))) {
            case "cameraMove":
                return touchDetection(event, "cameraMove");
            case "block":
            case "blocked":
                // unwanted
                return false;
            // case value:

            //     break;
            default:

                break;
        }
    }

    function cameraMoveDetect(event) {
        // return event;
        if (!previousMove["cameraMove"])
            return previousMove["cameraMove"] = event;
        let diff = event.timeStamp - previousMove["cameraMove"].timeStamp

        if (diff > (inf.deltatime * 10)) {
            previousMove["cameraMove"] = event;
            return false;
        }
        if (diff > (inf.deltatime)) {
            let X = event.touches[0].screenX - previousMove["cameraMove"].touches[0].screenX;
            let Y = event.touches[0].screenY - previousMove["cameraMove"].touches[0].screenY;
            previousMove["cameraMove"] = event;
            return { x: X, y: Y, start: { x: previousMove["cameraMove"].touches[0].screenX, y: previousMove["cameraMove"].touches[0].screenY } }
        }
        return false;

    }



    function viwePlaces(intervalForChengeLocation) {
        let interval;
        interval = setInterval(() => {
            if (!posSet.length)
                return clearInterval(interval);
            let { pos, rotation } = posSet.pop();
            // let camRotation = {
            //     x: rotation.x,
            //     y: rotation.y,
            //     z: rotation.z,
            // }
            let camRotation = [
                rotation.x,
                rotation.y,
                rotation.z,
            ]

            let end = dat.player.collider.getEndByStart(pos, dat.player.collider.height);
            return teleportPlayer(pos, end, end, camRotation)
        }, intervalForChengeLocation);
    }

    setTimeout(() => {
        // console.table(tmp)
    }, 10000);
}