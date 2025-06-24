document.addEventListener('DOMContentLoaded', () => {
    // --- Navbar ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    const animatedHeading = document.getElementById('animated-heading');
    const headings = ["StartupGenius AI", "Karobari Genius AI"];
    let headingIndex = 0;

    if(animatedHeading) {
        setInterval(() => {
            headingIndex = (headingIndex + 1) % headings.length;
            animatedHeading.classList.add('fade-out');
            
            setTimeout(() => {
                animatedHeading.textContent = headings[headingIndex];
                animatedHeading.classList.remove('fade-out');
            }, 500); // This must match the CSS transition duration
        }, 3000); // Change text every 3 seconds
    }

    const ideaTextarea = document.getElementById('idea');
    const placeholderPrompts = [
        "e.g., A mobile app connecting home cooks with customers...",
        "Masalan, local dastkaron ke liye ek online marketplace...",
        "e.g., An e-commerce store for sustainable products...",
        "Masalan, dunya bhar se nadir snacks ke liye ek subscription box..."
    ];
    let placeholderIndex = 0;

    if (ideaTextarea) {
        setInterval(() => {
            placeholderIndex = (placeholderIndex + 1) % placeholderPrompts.length;
            ideaTextarea.classList.add('placeholder-fade');
            
            setTimeout(() => {
                ideaTextarea.placeholder = placeholderPrompts[placeholderIndex];
                ideaTextarea.classList.remove('placeholder-fade');
            }, 500); // This must match the CSS transition duration
        }, 3000); // Change every 3 seconds
    }

    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const startOverBtn = document.getElementById('startOverBtn');
    
    const appContainer = document.getElementById('app-container');
    const mainContent = document.getElementById('main-content');
    const outputSection = document.getElementById('output-section');
    const planContent = document.getElementById('plan-content');
    const loader = document.getElementById('loader');
    const output = document.getElementById('output');

    generateBtn.addEventListener('click', async () => {
        const idea = ideaTextarea.value;
        if (!idea.trim()) {
            alert("Please enter a business idea.");
            return;
        }
        const language = document.querySelector('input[name="language"]:checked').value;

        // --- Start Loading State ---
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        loader.classList.remove('hidden');
        planContent.classList.add('hidden');
        outputSection.classList.remove('hidden');

        // --- Animate Layout Change ---
        appContainer.classList.remove('max-w-3xl');
        appContainer.classList.add('max-w-7xl');
        mainContent.classList.remove('w-full');
        mainContent.classList.add('md:w-1/3');

        try {
            const response = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idea, language })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.result) {
                output.innerHTML = marked.parse(data.result);
            } else {
                output.textContent = "Sorry, an error occurred. Please try again.";
            }
        } catch (error) {
            console.error("Fetch error:", error);
            output.textContent = `An error occurred: ${error.message}. Please check the server logs and try again.`;
        } finally {
            // --- End Loading State ---
            loader.classList.add('hidden');
            planContent.classList.remove('hidden');
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Business Plan';
        }
    });

    copyBtn.addEventListener('click', () => {
        const plainText = output.textContent;

        navigator.clipboard.writeText(plainText).then(() => {
            Toastify({
                text: "Copied to clipboard!",
                duration: 3000,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                stopOnFocus: true, // Prevents dismissing of toast on hover
            }).showToast();
        }, (err) => {
            console.error('Failed to copy text: ', err);
            Toastify({
                text: "Failed to copy text.",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                stopOnFocus: true,
            }).showToast();
        });
    });

    startOverBtn.addEventListener('click', () => {
        // --- Animate Layout Back ---
        appContainer.classList.add('max-w-3xl');
        appContainer.classList.remove('max-w-7xl');
        mainContent.classList.add('w-full');
        mainContent.classList.remove('md:w-1/3');

        // --- Reset UI Elements ---
        outputSection.classList.add('hidden');
        planContent.classList.add('hidden');
        loader.classList.add('hidden');
        output.innerHTML = '';
        ideaTextarea.value = '';
    });
}); 