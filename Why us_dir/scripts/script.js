/**
 * Velocity Effects
 *
 * First, A few Registered effects for velocity's ui kit.
 * Actual slider stuff below
 */


var scaleDownAmnt = 0.7;
var boxShadowAmnt = '40px';

$.Velocity.RegisterEffect("translateUp", {
  defaultDuration: 1,
  calls: [
    [{
      translateY: '-100%'
    }, 1]
  ]
});
$.Velocity.RegisterEffect("translateDown", {
  defaultDuration: 1,
  calls: [
    [{
      translateY: '100%'
    }, 1]
  ]
});
$.Velocity.RegisterEffect("translateNone", {
  calls: [
    [{
      translateY: '0',
      opacity: '1',
      scale: '1',
 
    }, 1]
  ]
});
//scale down
$.Velocity.RegisterEffect("scaleDown", {
  defaultDuration: 1,
  calls: [
    [{
      opacity: '0',
      scale: '0.7',
 
    }, 1]
  ]
});

//gallery
$.Velocity.RegisterEffect("scaleDown.moveUp", {
  defaultDuration: 1,
  calls: [
    [{
      translateY: '0%',
      scale: scaleDownAmnt,
 
    }, 0.20],
    [{
      translateY: '-100%'
    }, 0.60],
    [{
      translateY: '-100%',
      scale: '1',
      // boxShadowBlur: '0'
    }, 0.20]
  ]
});
$.Velocity.RegisterEffect("scaleDown.moveUp.scroll", {
  defaultDuration: 1,
  calls: [
    [{
      translateY: '-100%',
      scale: scaleDownAmnt,
 
    }, 0.60],
    [{
      translateY: '-100%',
      scale: '1',
      // boxShadowBlur: '0'
    }, 0.40]
  ]
});
$.Velocity.RegisterEffect("scaleUp.moveUp", {
  defaultDuration: 1,
  calls: [
    [{
      translateY: '90%',
      scale: scaleDownAmnt,
      // boxShadowBlur: boxShadowAmnt     
    }, 0.20],
    [{
      translateY: '0%'
    }, 0.60],
    [{
      translateY: '0%',
      scale: '1',
      // boxShadowBlur: '0'
    }, 0.20]
  ]
});
$.Velocity.RegisterEffect("scaleUp.moveUp.scroll", {
  defaultDuration: 1,
  calls: [
    [{
      translateY: '0%',
      scale: scaleDownAmnt,
      // boxShadowBlur: boxShadowAmnt
    }, 0.60],
    [{
      translateY: '0%',
      scale: '1',
      // boxShadowBlur: '0'
    }, 0.40]
  ]
});
$.Velocity.RegisterEffect("scaleDown.moveDown", {
  defaultDuration: 1,
  calls: [
    [{
      translateY: '0%',
      scale: scaleDownAmnt,
      // boxShadowBlur: boxShadowAmnt
    }, 0.20],
    [{
      translateY: '100%'
    }, 0.60],
    [{
      translateY: '100%',
      scale: '1',
      // boxShadowBlur: '0'
    }, 0.20]
  ]
});
$.Velocity.RegisterEffect("scaleDown.moveDown.scroll", {
  defaultDuration: 1,
  calls: [
    [{

    }, 0.60],
    [{
      translateY: '100%',
      scale: '1',
      // boxShadowBlur: '0'
    }, 0.40]
  ]
});
$.Velocity.RegisterEffect("scaleUp.moveDown", {
  defaultDuration: 1,
  calls: [
    [{
      translateY: '-90%',
      scale: scaleDownAmnt,
      // boxShadowBlur: boxShadowAmnt
    }, 0.20],
    [{
      translateY: '0%'
    }, 0.60],
    [{
      translateY: '0%',
      scale: '1',
      // boxShadowBlur: '0'
    }, 0.20]
  ]
});


function scrollToNextSlide() {
  // Check if the slider is not currently animating
  if (!VeloSlider.animating) {
    // Call the nextSlide function from your VeloSlider object
    VeloSlider.nextSlide();
  }
}

// Select the "register" button by its class
var registerButton = document.querySelector(".register");

// Add an event listener to the "register" button
if (registerButton) {
  registerButton.addEventListener("click", scrollToNextSlide);
}

/**
 * Velo Slider
 * A Custom Slider using Velocity and Velocity UI effects
 */

var VeloSlider = (function() {

  /**
   * Global Settings 
   */
  var settings = {
    veloInit: $('.velo-slides').data('velo-slider'),
    $veloSlide: $('.velo-slide'),
    veloSlideBg: '.velo-slide__bg',
    navPrev:  $('.velo-slides-nav').find('a.js-velo-slides-prev'),
    navNext:  $('.velo-slides-nav').find('a.js-velo-slides-next'),
    navNext2: $('register').find('a.js-velo-slides-next'),
    veloBtn:   $('.velo-slide__btn'),
    delta: 0,
    scrollThreshold: 7,
    currentSlide: 1,
    animating: false,
    animationDuration: 2000
  };


  // Flags
  var delta = 0,
      animating = false;

  return {
   
      /**
       * Init 
       */
      init: function() {
        this.bind();
        this.initTouchEvents(); // Initialize touch events for mobile devices
      },
    
      touchStartY: 0,
      touchEndY: 0,
      minSwipeDistance: 50,
  
      onTouchStart: function(e) {
        VeloSlider.touchStartY = e.touches[0].clientY;
      },
  
      onTouchMove: function(e) {
        VeloSlider.touchEndY = e.touches[0].clientY;
      },
  
      onTouchEnd: function(e) {
        var touchDistance = VeloSlider.touchEndY - VeloSlider.touchStartY;
  
        if (Math.abs(touchDistance) >= VeloSlider.minSwipeDistance) {
          if (touchDistance > 0) {
            VeloSlider.prevSlide();
          } else {
            VeloSlider.nextSlide();
          }
        }
      }, 

      // initTouchEvents: function() {
      //   settings.$veloSlide.on('touchstart', VeloSlider.onTouchStart);
      //   settings.$veloSlide.on('touchmove', VeloSlider.onTouchMove);
      //   settings.$veloSlide.on('touchend', VeloSlider.onTouchEnd);
      // },
    /**
     * Bind our click, scroll, key events
     */
    bind: function(){
 
      //  Add active to first slide to set it off
      settings.$veloSlide.first().addClass('is-active');

      //  Init with a data attribute, 
      //  Binding the animation to scroll, arrows, keys
      if (settings.veloInit == 'on') {
        VeloSlider.initScrollJack();
        $(window).on('DOMMouseScroll mousewheel', VeloSlider.scrollJacking);
      }

      // Arrow / Click Nav
      settings.navPrev.on('click', VeloSlider.prevSlide);
      settings.navNext.on('click', VeloSlider.nextSlide);
      settings.navNext2.on('click', VeloSlider.nextSlide);

    
      // Key Nav
      $(document).on('keydown', function(e) {
        var keyNext = (e.which == 39 || e.which == 40),
            keyPrev = (e.which == 37 || e.which == 38);

        if (keyNext && !settings.navNext.hasClass('inactive')) {
          e.preventDefault();
          VeloSlider.nextSlide();

        }
        else if (keyNext && !settings.navNext2.hasClass('inactive')) {
          e.preventDefault();
          VeloSlider.nextSlide();

        } else if (keyPrev && (!settings.navPrev.hasClass('inactive'))) {
          e.preventDefault();
          VeloSlider.prevSlide();
        }
      });
      
      // // Swipes
      // $(window).swipe(function( direction, offset ) {
      //   //if (offset < 100) { return; }
      //   if (direction == "up") { 
      //     VeloSlider.prevSlide(); 
      //     console.log('swipe up');

      //   }
      //   if (direction == "down") { VeloSlider.nextSlide(); } 
      // });

      
    
      //set navigation arrows visibility
      VeloSlider.checkNavigation();

      // Call Button Hover animation
      VeloSlider.hoverAnimation();
     
    },

    /**
     * Hover Animation
     * Adds 'is-hovering' class to the current slide
     * when hovering over the button.
     */
    hoverAnimation: function(){
      settings.veloBtn.hover(function (){
        $(this).closest(settings.$veloSlide).toggleClass('is-hovering');
      });
    },

    /** 
     * Set Animation
     * Defines the animation sequence, calling our registered velocity effects
     * @see js/components/_velocity-effects.js
     */
    setAnimation: function(midStep, direction) {
      
      // Vars for our velocity effects
      var animationVisible = 'translateNone',
          animationTop = 'translateUp',
          animationBottom = 'translateDown',
          easing = 'ease',
          animDuration = settings.animationDuration;

      // Middle Step
      if (midStep) {
        animationVisible = 'scaleUp.moveUp.scroll';
        animationTop = 'scaleDown.moveUp.scroll';
        animationBottom = 'scaleDown.moveDown.scroll';
      
      } else {
        animationVisible = (direction == 'next') ? 'scaleUp.moveUp' : 'scaleUp.moveDown';
        animationTop = 'scaleDown.moveUp';
        animationBottom = 'scaleDown.moveDown';
      }

      return [animationVisible, animationTop, animationBottom, animDuration, easing];
    },

    /** 
     * Init Scroll Jaclk
     */
    initScrollJack: function() {

      var visibleSlide = settings.$veloSlide.filter('.is-active'),
          topSection = visibleSlide.prevAll(settings.$veloSlide),
          bottomSection = visibleSlide.nextAll(settings.$veloSlide),
          animationParams = VeloSlider.setAnimation(false),
          animationVisible = animationParams[0],
          animationTop = animationParams[1],
          animationBottom = animationParams[2];
          console.log(animationParams);
          console.log(animationParams[4]);

      visibleSlide.children('div').velocity(animationVisible, 1, function() {
        visibleSlide.css('opacity', 1);
        topSection.css('opacity', 1);
        bottomSection.css('opacity', 1);
      });

      topSection.children('div').velocity(animationTop, 0);
      bottomSection.children('div').velocity(animationBottom, 0);
    },

    /**
     * Scroll Jack
     * On Mouse Scroll
     */
    scrollJacking: function(e) {
      if (e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0) {
        delta--;
        (Math.abs(delta) >= settings.scrollThreshold) && VeloSlider.prevSlide();
      } else {
        delta++;
        (delta >= settings.scrollThreshold) && VeloSlider.nextSlide();
      }
      return false;
    },

    /**
     * Previous Slide
     */
    prevSlide: function(e) {
      //go to previous section
      typeof e !== 'undefined' && e.preventDefault();
      
      var visibleSlide = settings.$veloSlide.filter('.is-active'),
          animationParams = VeloSlider.setAnimation(midStep, 'prev'),
          midStep = false;
      
      visibleSlide = midStep ? visibleSlide.next(settings.$veloSlide) : visibleSlide;

      console.log(midStep);

      if (!animating && !visibleSlide.is(":first-child")) {
        animating = true;
        
        visibleSlide
          .removeClass('is-active')
          .children(settings.veloSlideBg)
          .velocity(animationParams[2], animationParams[3], animationParams[4])
          .end()
          .prev(settings.$veloSlide)
          .addClass('is-active')
          .children(settings.veloSlideBg)
          .velocity(animationParams[0], animationParams[3], animationParams[4], function() {
            animating = false;
          });
        currentSlide = settings.currentSlide - 1;
      }
      VeloSlider.resetScroll();
    },

    

    /** 
     * Next Slide
     */
    nextSlide: function(e) {
      
      //go to next section
      typeof e !== 'undefined' && e.preventDefault();
      
      var visibleSlide = settings.$veloSlide.filter('.is-active'),
          animationParams = VeloSlider.setAnimation(midStep, 'next'),
          midStep = false;

      if (!animating && !visibleSlide.is(":last-of-type")) {
        animating = true;

        visibleSlide.removeClass('is-active')
          .children(settings.veloSlideBg)
          .velocity(animationParams[1], animationParams[3])
          .end()
          .next(settings.$veloSlide)
          .addClass('is-active')
          .children(settings.veloSlideBg)
          .velocity(animationParams[0], animationParams[3], function() {
            animating = false;
        });
        currentSlide = settings.currentSlide + 1;
      }
      VeloSlider.resetScroll();
    },

    /**
     * Reset SCroll
     */
    resetScroll: function() {
      delta = 0;
      VeloSlider.checkNavigation();
    },

    /**
     * Check Nav
     * Adds / hides nav based on first/last slide
     * @todo - loop slides, without cloning if possible
     */
    checkNavigation: function() {
      //update navigation arrows visibility
      (settings.$veloSlide.filter('.is-active').is(':first-of-type')) ? settings.navPrev.addClass('inactive'): settings.navPrev.removeClass('inactive');
      (settings.$veloSlide.filter('.is-active').is(':last-of-type')) ? settings.navNext.addClass('inactive'): settings.navNext.removeClass('inactive');
      (settings.$veloSlide.filter('.is-active').is(':last-of-type')) ? settings.navNext2.addClass('inactive'): settings.navNext2.removeClass('inactive');


    },
  };
})();

// INIT
VeloSlider.init();

var questions = [
  { question: "First name", type: "text", pattern: /^[A-Za-z]+$/ },
  { question: "Last name", type: "text", pattern: /^[A-Za-z]+$/ },
  { question: "Email", type: "text", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  { question: "South African ID", type: "text", pattern: /^\d{13}$/ },
  { question: "Upload your South African ID", type: "file" },
  { question: "Age", type: "number", pattern: /^\d{1,2}$/ },
  { question: "Phone Number", type: "number", pattern: /^\d{10}$/ },
  { question: "Alternative Phone Number", type: "number", pattern: /^\d{10}$/ },
  { question: "Gender", type: "text", pattern: /^(Male|Female)$/ },
  { question: "Ethnicity", type: "text", pattern: /^(African|White|Coloured|Indian|Other)$/ },
  { question: "Do you have a disability (Yes/ No)", type: "text", pattern: /^(Yes|No)$/ },
  { question: "Upload your disability letter", type: "file" },
  { question: "Highest Qualification", type: "text", pattern: /^(High School|Diploma|Matric|Bachelor's Degree|Master's Degree|Ph.D.)$/ },
  { question: "Upload your Highest Qualification", type: "file" },
  { question: "Course Interest", type: "text", pattern: /^(Learnaships|Bursaries|Accredited Skills Programs|Monitoring and Tracking of Skills Development Programs|Skills Development File Preparation|Implementation of Skills Development Strategy|Project and Risk Management|Hosting Solution|Skills Development GAP Analysis|Skills Development Scenario Plan|Cost Evaluation of Skills Development Strategy)$/ },
  { question: "Upload your proof of bank", type: "file" },
  { question: "Upload your SARS letter", type: "file" },
  { question: "Your Email will now open to confirm your registration, Ensure That You attach all necessary documents before sending the Email. Type Yes to continue.",  type: "text", pattern: /^(Yes|yes)$/  },
  { question: "Why should we help you?", type: "text" } // Add this line
];

(function () {
  var tTime = 100; // transition transform time from #register in ms
  var wTime = 200; // transition width time from #register in ms
  var eTime = 1000; // transition width time from inputLabel in ms

  // init
  // --------------
  var position = 0;

  putQuestion();

  progressButton.addEventListener("click", validate);
  inputField.addEventListener("keyup", function (e) {
    transform(0, 0); // ie hack to redraw
    if (e.keyCode == 13) validate();
  });

  // functions
  // --------------
  function createCombobox(options) {
    const select = document.createElement("select");
    for (const option of options) {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = option;
      select.appendChild(optionElement);
    }
    return select;
  }

  // load the next question
  function putQuestion() {
    if (
      questions[position].question === "Upload your disability letter" &&
      questions[position - 1].value.toLowerCase() !== "yes"
    ) {
      // If the answer is not "Yes" or "yes," skip this question
      position++;
      putQuestion();
      return;
    }

    inputLabel.innerHTML = questions[position].question;
    inputField.value = "";
    inputField.type = questions[position].type || "text";
    inputField.focus();
    showCurrent();
  }

  // when all the questions have been answered
  function done() {
    var name = questions[0].value;
    var email = questions[2].value;
    var surname = questions[1].value;
    var id = questions[3].value;
    var iddoc = questions[4].value;
    var age = questions[5].value;
    var phone = questions[6].value;
    var altphone = questions[7].value;
    var gender = questions[8].value;
    var ethnic = questions[9].value;
    var disability = questions[10].value;
    var disabilitylet = questions[11].value;
    var qual = questions[12].value;
    var qualdoc = questions[13].value;
    var corse = questions[14].value;
    var bank = questions[15].value;
    var sars = questions[17].value;
    var message = questions[18].value;

    // Construct the email content.
    var emailContent = "Name: " + name + "\n";
    emailContent += "Surname: " + surname + "\n";
    emailContent += "Phone Number: " + phone + "\n";
    emailContent += "Alternate Phone Number: " + altphone + "\n";
    emailContent += "Email: " + email + "\n\n";
    emailContent += "ID/Passport No.: " + id + "\n";
    emailContent += "Document Type: " + iddoc + "\n";
    emailContent += "Age: "+ age +"\n";
    emailContent += "Gender: " + gender + "\n";
    emailContent += "Ethnicity: " + ethnic + "\n";
    emailContent += "Disability: " + disability + "\n";
    emailContent += "Letter of Disability: " + disabilitylet + "\n";
    emailContent += "Qualification: " + qual + "\n";
    emailContent += "Qualification Document: " + qualdoc + "\n";
    emailContent += "Course: " + corse + "\n";
    emailContent += "Proof of bank: " + bank + "\n";
    emailContent += "SARS Letter: " + sars + "\n";
    emailContent += "Message:\n" + message;
    // remove the box if there is no next question
    register.className = "close";
    
    var recipient = "lethabolesheleba2003@gmail.com";

      // Construct the email subject.
      var subject = "New message from Student Registration form";

      // Send the email.
      var emailUrl = "mailto:" + recipient + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(emailContent);
      window.location.href = emailUrl;

      // Clear the form.

    // add the h1 at the end with the welcome text
    var h1 = document.createElement("h1");
    h1.appendChild(
      document.createTextNode(
        "Thank you " +
          questions[0].value +
          ". " +
          "Our team will get in touch with you shortly to discuss your specific needs and how we can help."
      )
    );
    setTimeout(function () {
      register.parentElement.appendChild(h1);
      setTimeout(function () {
        h1.style.opacity = 1;
      }, 50);
    }, eTime);
  }

  // when submitting the current question
  function validate() {
    // set the value of the field into the array
    questions[position].value = inputField.value;

    // check if the pattern matches
    if (!inputField.value.match(questions[position].pattern || /.+/)) wrong();
    else
      ok(function () {
        // set the progress of the background
        progress.style.width = ++position * 100 / questions.length + "vw";

        // if there is a new question, hide current and load next
        if (questions[position]) hideCurrent(putQuestion);
        else hideCurrent(done);
      });
  }

  // helper
  // --------------
  function hideCurrent(callback) {
    inputContainer.style.opacity = 0;
    inputProgress.style.transition = "none";
    inputProgress.style.width = 0;
    setTimeout(callback, wTime);
  }

  function showCurrent(callback) {
    inputContainer.style.opacity = 1;
    inputProgress.style.transition = "";
    inputProgress.style.width = "100%";
    setTimeout(callback, wTime);
  }

  function transform(x, y) {
    register.style.transform = "translate(" + x + "px ,  " + y + "px)";
  }

  function ok(callback) {
    register.className = "";
    setTimeout(transform, tTime * 0, 0, 10);
    setTimeout(transform, tTime * 1, 0, 0);
    setTimeout(callback, tTime * 2);
  }

  function wrong(callback) {
    register.className = "wrong";
    for (var i = 0; i < 6; i++) // shaking motion
      setTimeout(transform, tTime * i, (i % 2 * 2 - 1) * 20, 0);
    setTimeout(transform, tTime * 6, 0, 0);
    setTimeout(callback, tTime * 7);
  }
})();
