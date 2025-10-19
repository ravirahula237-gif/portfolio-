import { Component, AfterViewInit, OnInit } from '@angular/core';
declare var anime: any;
declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit, OnInit {
  ngAfterViewInit(): void {
    let textWrapper: any = document.querySelector('.c2 .letters');
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter' style='display:inline-block;'>$&</span>");

    anime.timeline({ loop: true })
      .add({
        targets: '.c2 .line',
        scaleY: [0, 1],
        opacity: [0.5, 1],
        easing: "easeOutExpo",
        duration: 700
      })
      .add({
        targets: '.c2 .line',
        translateX: [0, textWrapper.getBoundingClientRect().width + 15],
        easing: "easeOutExpo",
        duration: 700,
        delay: 100
      }).add({
        targets: '.c2 .letter',
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 600,
        offset: '-=775',
        delay: (el: HTMLElement, i: number) => 34 * (i + 1)
      }).add({
        targets: '.c2',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      });
  }

  ngOnInit(){
  $(function() {
    // Run the effect
    function runEffect() {
      // Set options for the effect
      var options = {};
      
      // Run the effect
      $(".effect").slideUp(500);
      // $(".effect").slideUp(1000, callback);

    }
  
    // Callback function to bring a hidden box back
    // function callback() {
    //   setTimeout(function() {
    //     $(".effect").removeAttr("style").hide().fadeIn();
    //   }, 1000);
    // }
  
    // Run the effect on button click
    $("#button").on("click", function() {
      runEffect();
    });
  });
  
  }

}
