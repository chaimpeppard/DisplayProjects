/* global $ */
(function () {
    'use strict';

    let movedParts = [];
    let dragging = false;
    let offset;
    let counter = 0;

    $(document).on('mousedown', '.box', e => {
        console.log('mouse down', e);
        dragging = $(e.target);     //IMPORTANT: dragging is NOW the NAME of the target of the event
        movedParts.push(dragging);
        offset = { y: e.offsetY, x: e.offsetX, };
        dragging.css("position", "absolute");
        dragging.css("z-index", `${counter++}`);
       


    }).mousemove(e => {
        e.preventDefault();
        if (dragging) {

            console.log('mouse move', e);
            dragging.css({ top: e.pageY - offset.y, left: e.pageX - offset.x });
        }

    }).mouseup(e => {
        if (dragging) {
            localStorage.setItem(dragging[0].id, JSON.stringify({
                id: dragging[0].id,
                zIndex: dragging.css("z-index"),
                top: dragging.css("top"),
                left: dragging.css("left"),
                position: dragging.css("position")
            }));
        }
        console.log('mouse up', e);
        dragging = false;

    });

    console.log(localStorage);
    for (let i = 0; i < 50; i++) {
        console.log(localStorage.getItem(i));
        if (localStorage.getItem(i)) {
            const item = JSON.parse(localStorage.getItem(i));
            const theJqueryItem = $(`#${i}`);       //this fixed the reset bug- it didnt work if refresh was pressed already
            theJqueryItem.css({
                top: item.top,
                left: item.left,
                "z-index": item.zIndex,
                "position": item.position
            });
            movedParts.push(theJqueryItem);  //this fixed the reset bug- it didnt work if refresh was pressed already
        }
    }
    document.querySelector("#reset").addEventListener("click", () => {

        // THE ARROW MAKES IT WAIT FOR THE CLICK!
        //MEANING: the arrow returns a function 
        //that goes INTO the click. It's now declaration (hey theres a function here!), not invocation (do this fuction NOW!)

        //  movedParts.forEach(part => part.css({ top: 0, left: 0, zIndex: 0, position: "relative" }));   /*THIS is how with arrow function*/
        movedParts.forEach(function (part) { part.css({ top: 0, left: 0, zIndex: 0, position: "relative" }); });
        localStorage.clear();

    });
setTimeout(() => {
   //IN HERE put what should happen when timer runs out, however, it will only work ONCE. 
   //Somehow- reset button should call do the timeout function again- but how? interval- counter, when hit multiple of 30, action happens- change timeout to interval
   //interval based on second- when multiple of 30,  
}, 30000);


}());


/* EXPLANATION OF LINES  55-60 by Sir Nachman Kellman, esq.:
          
        movedParts is an array of jquery stuff. jquery is a fancy representation of html elements. We can THUS manipulate HTML 
        elements by manipulating our movedParts array. 
        
        wwhen you click ANYthing on the page- "Dragging" becomes the jquery representation of that clicked thing.
        jquery changes the css AS WELL by using the .css function (this function belongs to jquery).


        (review for each loops!)








        */