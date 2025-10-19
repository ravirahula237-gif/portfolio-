import { AfterViewInit, Component } from '@angular/core';
import * as $ from 'jquery';
declare const IN: any; // declare LinkedIn global variable

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {


  // ngAfterViewInit(): void {

  //       // Check if LinkedIn SDK is loaded
  //   if (typeof IN !== 'undefined' && IN && IN.parse) {
  //     IN.parse(); // Tell LinkedIn to scan and render the widget
  //   }



  //   let isMousePressed = false;
  //   $(".gallery_img").hover(function (this: HTMLElement) {
  //     const $hovered = $(this);

  //     const hoverRect = $hovered[0].getBoundingClientRect();
  //     const hoverOffset = $hovered.offset();
  //     const hoverCenterX = hoverOffset!.left + $hovered.width()! / 2;
  //     const hoverCenterY = hoverOffset!.top + $hovered.height()! / 2;
  //     const angle = getComputedStyle($hovered[0]).getPropertyValue("--angle").trim() || "0deg";

  //     $(".gallery_img").each(function () {
  //       const $img = $(this);

  //       if ($img.is($hovered) && isMousePressed) {
  //         $img.css("transform", `scale(1)`);
  //         // $img.css("transform", `translate(var(--x, 0), var(--y, 0)) rotate(0deg) scale(1.2)`);
  //       } else if (!isMousePressed) {

  //         const imgRect = $img[0].getBoundingClientRect();
  //         const isOverlapping = !(
  //           imgRect.right < hoverRect.left ||
  //           imgRect.left > hoverRect.right ||
  //           imgRect.bottom < hoverRect.top ||
  //           imgRect.top > hoverRect.bottom
  //         );

  //         if (!isOverlapping) return;


  //         const imgOffset = $img.offset();
  //         const imgCenterX = imgOffset!.left + $img.width()! / 2;
  //         const imgCenterY = imgOffset!.top + $img.height()! / 2;

  //         const deltaX = imgCenterX - hoverCenterX;
  //         const deltaY = imgCenterY - hoverCenterY;
  //         const distance = 5;
  //         // const moveX = (deltaX === 0 ? 0 : (deltaX / Math.abs(deltaX)) * distance);
  //         // const moveY = (deltaY === 0 ? 0 : (deltaY / Math.abs(deltaY)) * distance);

  //         let moveX = 0, moveY = 0;
  //         if (Math.abs(deltaX) > Math.abs(deltaY)) {
  //           // push horizontally
  //           moveX = deltaX > 0 ? distance : -distance;
  //         } else {
  //           // push vertically
  //           moveY = deltaY > 0 ? distance : -distance;
  //         }




  //         $img.css(
  //           "transform",
  //           `translate(var(--x, 0), var(--y, 0)) rotate(var(--angle, 0deg)) translate(${moveX}px, ${moveY}px) scale(1)`
  //         );
  //       }
  //     });

  //     // Mouse down / fixed effect on hovered image
  //     $hovered.off("mousedown").on("mousedown", function () {
  //       isMousePressed = true;
  //       $(this).css({
  //         "position": "fixed",
  //         "top": "50%",
  //         "left": "50%",
  //         "transform": "translate(-50%, -50%) rotate(0deg) scale(2)",
  //         "z-index": 20,
  //         // "width": '80vh',
  //         "background": 'transparent',
  //         // "height": '80vh',
  //         "cursor": 'grabbing'
  //       });
  //     });

  //     // Mouse up or leave: reset hovered image
  //     $hovered.off("mouseup mouseleave").on("mouseup mouseleave", function () {
  //       const resetAngle = getComputedStyle($hovered[0]).getPropertyValue("--angle").trim() || "0deg";
  //       isMousePressed = false;
  //       $(this).css({
  //         "position": "absolute",
  //         "transform": `translate(var(--x,0), var(--y,0)) rotate(${resetAngle}) scale(1)`,
  //         "z-index": "",
  //         "max-width": '280px',
  //         "max-height": '250px',
  //         "cursor": 'grab',
  //         "scale": 1,
  //       });
  //     });

  //     $hovered.css("transform", `translate(var(--x, 0), var(--y, 0)) rotate(${angle}) scale(1.05)`);
  //   }, function (this: HTMLElement) {
  //     // mouse leave
  //     $(".gallery_img").each(function (this: HTMLElement) {
  //       $(this).css("transform", `translate(var(--x, 0), var(--y, 0)) rotate(var(--angle, 0deg)) scale(1)`);
  //     });
  //   });

  // }


  ngAfterViewInit(): void {

    if (typeof IN !== 'undefined' && IN && IN.parse) {
      IN.parse(); // LinkedIn widget
    }

    let isPressed = false;

    const applyHoverEffect = ($hovered: JQuery<HTMLElement>) => {
      const hoverRect = $hovered[0].getBoundingClientRect();
      const hoverOffset = $hovered.offset()!;
      const hoverCenterX = hoverOffset.left + $hovered.width()! / 2;
      const hoverCenterY = hoverOffset.top + $hovered.height()! / 2;
      const angle = getComputedStyle($hovered[0]).getPropertyValue("--angle").trim() || "0deg";

      $(".gallery_img").each(function () {
        const $img = $(this);

        if ($img.is($hovered) && isPressed) {
          $img.css("transform", `scale(1)`);
        } else if (!isPressed) {
          const imgRect = $img[0].getBoundingClientRect();
          const isOverlapping = !(
            imgRect.right < hoverRect.left ||
            imgRect.left > hoverRect.right ||
            imgRect.bottom < hoverRect.top ||
            imgRect.top > hoverRect.bottom
          );

          if (!isOverlapping) return;

          const imgOffset = $img.offset()!;
          const imgCenterX = imgOffset.left + $img.width()! / 2;
          const imgCenterY = imgOffset.top + $img.height()! / 2;
          const deltaX = imgCenterX - hoverCenterX;
          const deltaY = imgCenterY - hoverCenterY;
          const distance = 5;

          let moveX = 0, moveY = 0;
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            moveX = deltaX > 0 ? distance : -distance;
          } else {
            moveY = deltaY > 0 ? distance : -distance;
          }

          $img.css("transform", `translate(var(--x, 0), var(--y, 0)) rotate(var(--angle, 0deg)) translate(${moveX}px, ${moveY}px) scale(1)`);
        }
      });

      $hovered.css("transform", `translate(var(--x, 0), var(--y, 0)) rotate(${angle}) scale(1.05)`);
    };

    const resetHoverEffect = () => {
      $(".gallery_img").each(function () {
        $(this).css("transform", `translate(var(--x, 0), var(--y, 0)) rotate(var(--angle, 0deg)) scale(1)`);
      });
    };

    // ✅ Combined for both desktop & mobile
    $(".gallery_img")
      .on("mouseenter touchstart", function (event) {
        const $hovered = $(this);
        applyHoverEffect($hovered);

        // Handle press / zoom on touch or mouse down
        $(this).off("mousedown touchstart.hold").on("mousedown touchstart.hold", function (e) {
          isPressed = true;
          $(this).css({
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(0deg) scale(4)",
            "z-index": 20,
            background: "transparent",
            cursor: "grabbing",
          });
          e.preventDefault();
        });
      })
      .on("mouseleave touchend touchcancel", function () {
        const $hovered = $(this);
        const resetAngle = getComputedStyle($hovered[0]).getPropertyValue("--angle").trim() || "0deg";
        isPressed = false;
        $(this).css({
          position: "absolute",
          transform: `translate(var(--x,0), var(--y,0)) rotate(${resetAngle}) scale(1)`,
          "z-index": "",
          "max-width": "280px",
          "max-height": "250px",
          cursor: "grab",
        });
        resetHoverEffect();
      });
  }



}
