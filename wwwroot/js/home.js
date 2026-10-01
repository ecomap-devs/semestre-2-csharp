<script>

    const backToTopButton = document.getElementById('backToTop');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
        backToTopButton.classList.remove('hidden');
            } else {
        backToTopButton.classList.add('hidden');
            }
        });
        
        backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
        });


    const biomeButtons = document.querySelectorAll('.map-container + div button');
        biomeButtons.forEach(button => {
        button.addEventListener('click', () => {

            console.log(`Mostrando dados para: ${button.textContent}`);
        });
        });
</script>
