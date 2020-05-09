// Get all slider wrappers
const sliderWrappers = document.querySelectorAll('[data-slider-wrapper]');

// Check if wrappers exist on page
if(sliderWrappers.length > 0) {
  // Loop through each wrapper element
  sliderWrappers.forEach(wrapper => {
    // Get elements
    const slider = wrapper.querySelector('[data-slider]');
    const prevBtn = wrapper.querySelector('[data-prev]');
    const nextBtn = wrapper.querySelector('[data-next]');
    const slides = slider.querySelectorAll('[data-slide]');
    const sliderNav = wrapper.querySelector('[data-slider-nav]');

    // Make first slide active
    // Disable prev button
    // Create navigation elements(dots)
    slider.querySelector('[data-slide]:first-child').classList.add('active');
    prevBtn.disabled = true;
    createNavElements(slides, sliderNav);

    // Add click event to buttons
    prevBtn.addEventListener('click', showPrevSlide.bind(slider, nextBtn));
    nextBtn.addEventListener('click', showNextSlide.bind(slider, prevBtn));
  });
}

// Create nav elements/dots
function createNavElements(slides, sliderNav) {
  // For each slide create one dot
  for(let i = 0; i < slides.length; i++) {
    const span = document.createElement('span');
    if(i === 0) { // Add active class to first element
      span.classList.add('active');
    }
    // Add click event to each dot
    span.addEventListener('click', changeSlide);
    sliderNav.appendChild(span);
  }
}

// Change slide
function changeSlide() {
  // Get slider, all slides and active slide
  // Convert nav elements nodeList to array
  // Get the index of clicked nav element
  const slider = this.closest('[data-slider-wrapper]').querySelector('[data-slider]');
  const slides = slider.querySelectorAll('[data-slide]');
  const activeSlide = slider.querySelector('.active[data-slide]');
  const navArr = Array.prototype.slice.call(this.parentElement.children);
  const navElIndex = navArr.indexOf(this);

  // Remove active class from active nav element
  for(let i = 0; i < navArr.length; i++) {
    if(navArr[i].classList.contains('active')) {
      navArr[i].classList.remove('active');
      break;
    }
  }

  // Add active class to clicked nav element
  // Change slider transform property
  this.classList.add('active');
  slider.style.transform = `translateX(${navElIndex * -100 + '%'})`;

  // Remove active class from active slide
  // Add active class to slide that has the same index as clicked nav element
  activeSlide.classList.remove('active');
  slides[navElIndex].classList.add('active');

  // Get buttons and update them
  const prevBtn = this.closest('[data-slider-wrapper]').querySelector('[data-prev]');
  const nextBtn = this.closest('[data-slider-wrapper]').querySelector('[data-next]');
  updateButtons(prevBtn, nextBtn, navElIndex, slides.length, null);
}

// Show previous slide
function showPrevSlide(nextBtn, e) {
  e.preventDefault();

  // Get all slides and convert them from nodelist to array
  // Get the active slide
  // Get the index of active slide
  const slides = this.querySelectorAll('[data-slide]');
  const slidesArr = Array.prototype.slice.call(slides);
  const activeSlide = this.querySelector('.active');
  const activeSlideIndex = slidesArr.indexOf(activeSlide);

  // Check if number of slides is bigger than the index of active slide and if the index of active slide is not 0, in this case change to previous slide
  if(slidesArr.length > activeSlideIndex && activeSlideIndex !== 0) {
    // Remove active class from active slide
    // Get current slide and add active class to it
    // Change transform property on slider element
    // Update nav elements - change active class
    activeSlide.classList.remove('active');
    const currentSlide = slidesArr[activeSlideIndex - 1];
    currentSlide.classList.add('active');
    this.style.transform = `translateX(${(slidesArr.indexOf(currentSlide)) * -100}%)`;
    updateNavElements(activeSlideIndex - 1, this.parentElement.querySelector('[data-slider-nav]')); 
  }

  // Update buttons
  updateButtons(e.target, nextBtn, activeSlideIndex, null, 'prev');
}

// Show next slide
function showNextSlide(prevBtn, e) {
  e.preventDefault();

  // Get all slides
  // Convert slides to array
  // Get active slide and the index of active slide
  const slides = this.querySelectorAll('[data-slide]');
  const slidesArr = Array.prototype.slice.call(slides);
  const activeSlide = this.querySelector('.active');
  const activeSlideIndex = slidesArr.indexOf(activeSlide);

  // Check if number of slides is bigger than index of active slide plus 1 and in this case change to next slide
  if(slidesArr.length > slidesArr.indexOf(activeSlide) + 1) {
    // Remove active class from active slide
    // Get current slide and add active class to it
    // Change transform property on slider element
    // Update nav elements
    activeSlide.classList.remove('active');
    const currentSlide = slidesArr[activeSlideIndex + 1];
    currentSlide.classList.add('active');
    this.style.transform = `translateX(${(slidesArr.indexOf(currentSlide)) * -100}%)`;
    updateNavElements(activeSlideIndex + 1, this.parentElement.querySelector('[data-slider-nav]'));
  }

  // Update buttons
  updateButtons(prevBtn, e.target, activeSlideIndex, slidesArr.length, 'next');
}

// Update buttons
function updateButtons(prev, next, index, numOfSlides, clickedBtn) {
  // Check if prev button is clicked
  if(clickedBtn === 'prev') {
    // If index of active slide is 1 disable prev button
    if(index === 1) {
      prev.disabled = true;
    }
    // Enable next button if it is disabled
    if(next.disabled) {
      next.disabled = false;
    }
  }else if(clickedBtn === 'next') { // check if next button is clicked
    // If active slide index + 2 is equal to number of slides disable next button
    // If the active slide is 4th of 5 slides when you click on next button active index is 3 because at this moment slide 4 is active
    if(index + 2 === numOfSlides) {
      next.disabled = true;
    }

    // If prev button is disabled then enable it
    if(prev.disabled) {
      prev.disabled = false;
    }
  }else { // Execute this code if non of the button is clicked
    // Check if active slide index is 0 and if prev button is not disabled, in this case disable it
    // And if index if greater than 0 and prev button is disabled then enable it
    if(index === 0 && !prev.disabled) {
      prev.disabled = true;
    }else if(index > 0 && prev.disabled) {
      prev.disabled = false;
    }

    // Check if active slide index + 1 is equal to number of slides and next button is not disabled the disable it
    // And if active slide index is smaller than the number of slides and next button is disabled then enable it
    if(index + 1 === numOfSlides && !next.disabled) {
      next.disabled = true;
    }else if(index < numOfSlides && next.disabled) {
      next.disabled = false;
    }
  }
}

// Update nav elements
function updateNavElements(index, sliderNav) {
  // Loop through all dots
  for(let i = 0; i < sliderNav.children.length; i++) {
    // Check if nav element has active class and if so remove it from nav element and break from the loop
    if(sliderNav.children[i].classList.contains('active')) {
      sliderNav.children[i].classList.remove('active');
      break;
    }
  }
  // Add active class to nav element that has the same index as active slide
  sliderNav.children[index].classList.add('active');
}