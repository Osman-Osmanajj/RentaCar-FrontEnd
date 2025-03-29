document.addEventListener('DOMContentLoaded', function() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentIndex = 0;
    function showTestimonial(index) {
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
    }
    nextBtn.addEventListener('click', function() {
        currentIndex++;
        if (currentIndex >= testimonials.length) {
            currentIndex = 0;
        }
        showTestimonial(currentIndex);
    });
    
    prevBtn.addEventListener('click', function() {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = testimonials.length - 1;
        }
        showTestimonial(currentIndex);
    });
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentIndex = index;
            showTestimonial(currentIndex);
        });
    });
    setInterval(function() {
        currentIndex++;
        if (currentIndex >= testimonials.length) {
            currentIndex = 0;
        }
        showTestimonial(currentIndex);
    }, 5000);
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
});