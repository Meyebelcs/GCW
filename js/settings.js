//===========SLIDERS=========================
function initializeSlider(sliderSelector, barSelector, controlButtonSelector, updateFunction) {
    const slider = document.querySelector(sliderSelector);
    const bar = document.querySelector(barSelector);
    const controlButton = document.querySelector(controlButtonSelector);

    let isDragging = false;

    controlButton.style.top = "100%";

    controlButton.addEventListener("mousedown", (e) => {
        isDragging = true;
        controlButton.style.transition = "none";
        let offsetY = e.clientY - controlButton.getBoundingClientRect().top;

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;

            let newPosition = e.clientY - bar.getBoundingClientRect().top - offsetY;
            let minPosition = 0;
            let maxPosition = bar.clientHeight - controlButton.clientHeight;

            if (newPosition < minPosition) {
                newPosition = minPosition;
            } else if (newPosition > maxPosition) {
                newPosition = maxPosition;
            }

            let positionPercentage = (newPosition / maxPosition) * 100;
            controlButton.style.top = `${positionPercentage}%`;
            updateFunction(newPosition, maxPosition, bar);
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            controlButton.style.transition = "top 0.2s ease-in-out";
        });
    });
}

function updateVolume(position, maxPosition, bar) {
    let volume = 1 - position / maxPosition;
    bar.style.background = `linear-gradient(to top, #8a2be2 ${volume * 100}%, #e0e0e0 ${volume * 100}%)`;
    // Realiza las acciones relacionadas con el volumen aquí.
}

initializeSlider(".slider-left", ".bar-left", ".control-button-left", updateVolume);
initializeSlider(".slider-right", ".bar-right", ".control-button-right", updateVolume);

//===========BUTTON-VOLUME=========================

// Función para inicializar un botón de control
function initializeControlButton(buttonId, muteImage, unmuteImage, unmuteImage2) {
    const button = document.getElementById(buttonId);
    let isMuted = false;

    function toggleMute() {
        isMuted = !isMuted;
        button.src = isMuted ? muteImage : unmuteImage;
    }

    button.addEventListener('click', toggleMute);

    button.addEventListener('mouseover', () => {
        button.style.transform = 'scale(1.1)';
        if (!isMuted) {
            button.src = unmuteImage2;
        }
    });

    button.addEventListener('mouseout', () => {
        if (!isMuted) {
            button.src = unmuteImage;
            button.style.transform = 'scale(1)';
        } else {
            button.style.transform = 'scale(1)';
        }

    });
}

// Inicializar el botón de volumen
initializeControlButton('volume-button', 'Assets/btn_NoVolume.png', 'Assets/btn_volume1.png', 'Assets/btn_volume2.png');

// Inicializar el botón de música
initializeControlButton('music-button', 'Assets/btn_NoMusic.png', 'Assets/btn_music1.png', 'Assets/btn_music2.png');