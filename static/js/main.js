// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize counter animations for KPI values
    initCounters();

    // Initialize ERP diagram interactions
    initERPDiagram();

    // Add data flow animations to connection lines
    addDataFlowAnimations();

    // Initialize tab navigation
    initTabNavigation();

    // Initialize receiving process if on receiving page
    if (document.getElementById('receiving-map')) {
        initReceivingProcess();
    }
});

// Counter animation for KPI values
function initCounters() {
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const decimalPlaces = (target.toString().split('.')[1] || '').length;
        const duration = 2000; // Animation duration in milliseconds
        const frameRate = 60; // Frames per second
        const increment = target / (duration / 1000 * frameRate);

        let current = 0;
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (current > target) current = target;
                counter.textContent = current.toFixed(decimalPlaces);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toFixed(decimalPlaces);
            }
        };

        updateCounter();
    });
}

// ERP diagram interactions
function initERPDiagram() {
    const diagram = document.getElementById('erp-diagram');
    if (!diagram) return;

    const departmentCircles = diagram.querySelectorAll('.department-circle');
    const connectionLines = diagram.querySelectorAll('.connection-line');

    // Add hover effects for departments
    departmentCircles.forEach(circle => {
        const department = circle.getAttribute('data-department');

        circle.addEventListener('mouseenter', () => {
            // Highlight the department and its connection
            circle.style.fill = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');

            // Find and highlight the corresponding connection line
            connectionLines.forEach(line => {
                if (line.getAttribute('data-department') === department) {
                    line.style.stroke = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
                    line.style.strokeWidth = '5';
                    line.classList.add('data-flow');
                }
            });
        });

        circle.addEventListener('mouseleave', () => {
            // Reset the department and its connection
            circle.style.fill = '';

            // Reset the corresponding connection line
            connectionLines.forEach(line => {
                if (line.getAttribute('data-department') === department) {
                    line.style.stroke = '';
                    line.style.strokeWidth = '';
                    line.classList.remove('data-flow');
                }
            });
        });

        // Make departments clickable to navigate to their sections
        circle.addEventListener('click', () => {
            const sectionId = `#${department}`;
            const section = document.querySelector(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Add data flow animations to connection lines
function addDataFlowAnimations() {
    // Randomly select connection lines to animate
    const connectionLines = document.querySelectorAll('.connection-line');
    const linesToAnimate = Array.from(connectionLines).sort(() => 0.5 - Math.random()).slice(0, 3);

    linesToAnimate.forEach(line => {
        line.classList.add('data-flow');

        // Remove animation after some time and apply to different lines
        setTimeout(() => {
            line.classList.remove('data-flow');

            // Select a different line to animate
            const remainingLines = Array.from(connectionLines).filter(l => !linesToAnimate.includes(l));
            if (remainingLines.length > 0) {
                const newLine = remainingLines[Math.floor(Math.random() * remainingLines.length)];
                newLine.classList.add('data-flow');
            }
        }, 5000 + Math.random() * 5000); // Random duration between 5-10 seconds
    });
}

// Warehouse map visualization with interactive elements
function initWarehouseMap() {
    console.log("initWarehouseMap function called");
    const warehouseMap = document.getElementById('warehouse-map');
    console.log("Warehouse map element:", warehouseMap);
    if (!warehouseMap) {
        console.error("Warehouse map element not found");
        return;
    }

    // Create pallet truck element for 2D map
    const palletTruck = document.createElement('div');
    palletTruck.className = 'pallet-truck';
    palletTruck.innerHTML = '<i class="fas fa-truck"></i>';
    console.log("Pallet truck element created");

    // Set initial position for truck
    palletTruck.style.left = '60px';
    palletTruck.style.top = '650px';
    console.log("Pallet truck initial position set");

    warehouseMap.appendChild(palletTruck);
    console.log("Pallet truck appended to warehouse map");

    // Define picking route points - expanded to use full map area
    const routePoints = [
        { x: 60, y: 650 },    // Start
        { x: 60, y: 100 },    // Move to aisle A
        { x: 200, y: 100 },   // Location A-12-05
        { x: 350, y: 100 },   // Location A-14-08
        { x: 500, y: 100 },   // Location A-16-12
        { x: 650, y: 100 },   // Location A-18-15
        { x: 750, y: 100 },   // Move to connector A-B
        { x: 750, y: 250 },   // Move through connector
        { x: 750, y: 350 },   // Move to aisle B
        { x: 650, y: 350 },   // Location B-05-10
        { x: 450, y: 350 },   // Location B-07-22
        { x: 250, y: 350 },   // Location B-09-30
        { x: 100, y: 350 },   // Move to connector B-C
        { x: 100, y: 450 },   // Move through connector
        { x: 100, y: 550 },   // Move to aisle C
        { x: 250, y: 550 },   // Location C-01-05
        { x: 450, y: 550 },   // Location C-03-18
        { x: 650, y: 550 }    // Location C-05-22
    ];

    // Define location data
    const locationData = [
        { 
            location: 'A-12-05', 
            product: 'NIP-KR-42', 
            quantity: 5,
            description: 'Νιπτήρας Μπάνιου Κρεμαστός'
        },
        { 
            location: 'A-14-08', 
            product: 'NIP-EP-35', 
            quantity: 3,
            description: 'Νιπτήρας Μπάνιου Επιτραπέζιος'
        },
        { 
            location: 'A-16-12', 
            product: 'LKN-BT-60', 
            quantity: 2,
            description: 'Λεκάνη Μπάνιου με Καζανάκι'
        },
        { 
            location: 'A-18-15', 
            product: 'KTH-MR-90', 
            quantity: 4,
            description: 'Καθρέπτης Μπάνιου με LED'
        },
        { 
            location: 'B-05-10', 
            product: 'NTP-PL-55', 
            quantity: 6,
            description: 'Ντουζιέρα Πλακέ 80x120'
        },
        { 
            location: 'B-07-22', 
            product: 'KAB-NT-80', 
            quantity: 2,
            description: 'Καμπίνα Ντουζιέρας 80x80'
        },
        { 
            location: 'B-09-30', 
            product: 'KAB-NT-90', 
            quantity: 3,
            description: 'Καμπίνα Ντουζιέρας 90x90'
        },
        { 
            location: 'C-01-05', 
            product: 'VR-NT-22', 
            quantity: 5,
            description: 'Βρύση Ντουζιέρας Τηλέφωνο'
        },
        { 
            location: 'C-03-18', 
            product: 'VR-INX-27', 
            quantity: 3,
            description: 'Βρύση Μπάνιου Inox'
        },
        { 
            location: 'C-05-22', 
            product: 'VR-BSN-30', 
            quantity: 4,
            description: 'Βρύση Νιπτήρα Μαύρη Ματ'
        }
    ];

    // Animate pallet truck along the route
    let currentPointIndex = 0;

    function moveToNextPoint() {
        console.log("moveToNextPoint called, currentPointIndex:", currentPointIndex, "routePoints.length:", routePoints.length);

        // If we're currently processing a location, wait and check again later
        if (processingLocation) {
            console.log("Processing location, waiting 1 second before checking again");
            setTimeout(moveToNextPoint, 1000); // Check again in 1 second
            return;
        }

        // Check if we've reached the end of the route
        if (currentPointIndex >= routePoints.length) {
            console.log("Route complete, stopping at final point");
            // Don't reset - stop at the final point

            // Create and show restart button
            showRestartButton();
            return;
        }

        // Special handling for when we're at the final collection point but not yet processed
        // This ensures we process the final collection point before showing the restart button
        if (currentPointIndex === 17 && !processingLocation) {
            console.log("At final collection point but not yet processed");
            // Continue with normal processing to ensure the final collection is handled
        }

        // Special check for the final collection point (index 17)
        // This ensures we don't skip the final collection point
        if (currentPointIndex === 17) {
            console.log("Reached the final collection point (index 17)");
            // Make sure the final collection point is properly processed
            const progressBar = document.getElementById('picking-progress');
            if (progressBar) {
                progressBar.style.width = '100%';
            }

            // Update checkpoints to mark the final one as completed
            const checkpoints = document.querySelectorAll('.progress-checkpoint');
            checkpoints.forEach((checkpoint, index) => {
                if (index === 9) { // The tenth checkpoint (index 9) corresponds to the final collection point
                    checkpoint.classList.add('completed');
                    const checkpointDot = checkpoint.querySelector('.checkpoint-dot');
                    if (checkpointDot) {
                        checkpointDot.style.backgroundColor = 'var(--success-color)';
                        checkpointDot.style.borderColor = 'var(--success-color)';
                    }
                }
            });
        }

        const targetPoint = routePoints[currentPointIndex];
        console.log("Moving to point:", currentPointIndex, "coordinates:", targetPoint.x, targetPoint.y);
        animateTruck(targetPoint.x, targetPoint.y);

        // Check if this is a picking location based on the new route points
        // Picking locations are at indices: 2, 3, 4, 5, 9, 10, 11, 15, 16, 17
        const pickingLocations = [2, 3, 4, 5, 9, 10, 11, 15, 16, 17];

        if (pickingLocations.includes(currentPointIndex)) {
            console.log("This is a picking location at index:", currentPointIndex);
            // Show picking action at this location
            showPickingAction(targetPoint.x, targetPoint.y, currentPointIndex);
            console.log("Picking action shown, waiting for RFID process to complete");

            // Don't increment currentPointIndex yet - we'll do that after processing is complete
            // The processingLocation flag will be set to true in updateRFIDProcess
            // and will be set to false when the user completes all RFID stages
        } else {
            console.log("This is not a picking location, moving to next point");
            // If this is not a picking location, continue to the next point
            currentPointIndex++;
        }
    }

    function resetProgressIndicators() {
        // Reset RFID process state variables
        currentRFIDState = 0;
        processingLocation = false;

        // Reset progress bar
        const progressBar = document.getElementById('picking-progress');
        if (progressBar) {
            progressBar.style.width = '0%';
        }

        // Reset checkpoints
        const checkpoints = document.querySelectorAll('.progress-checkpoint');
        checkpoints.forEach(checkpoint => {
            checkpoint.classList.remove('completed');

            // Reset checkpoint dot colors
            const checkpointDot = checkpoint.querySelector('.checkpoint-dot');
            if (checkpointDot) {
                checkpointDot.style.backgroundColor = '#e9ecef';
                checkpointDot.style.borderColor = 'var(--primary-color)';
            }
        });

        // Reset document changes
        const documentChanges = document.getElementById('document-changes');
        if (documentChanges) {
            const completedItems = documentChanges.querySelectorAll('.change-item:not(.pending)');
            completedItems.forEach((item, index) => {
                if (index > 1) { // Keep the first two items as completed
                    item.classList.add('pending');
                    const timeElement = item.querySelector('.change-time');
                    if (timeElement) {
                        timeElement.textContent = '--:--';
                    }
                }
            });
        }

        // Reset RFID process to initial state
        const dynamicRFIDProcess = document.getElementById('dynamic-rfid-process');
        if (dynamicRFIDProcess && locationData[0]) {
            const locationInfo = locationData[0];

            // Define the different states of the RFID process
            const rfidStates = [
                // State A: Οθόνη Συσκευής RFID
                `<h3><i class="fas fa-barcode"></i> Διαδικασία Συλλογής με RFID και Σάρωση Barcode</h3>
                <div class="device-screen">
                    <div class="screen-header">A. Οθόνη Συσκευής RFID</div>
                    <div class="screen-content">
                        <div class="screen-item">
                            <p class="screen-title">Λίστα Συλλογής: PL-2023-4872</p>
                            <p class="screen-subtitle">Εργαζόμενος: Γιώργος Παπαδόπουλος</p>
                        </div>

                        <div class="screen-item">
                            <p class="screen-title">Επόμενο Προϊόν:</p>
                            <p>${locationInfo.product} - ${locationInfo.quantity} τεμάχια</p>
                            <p class="location-path">Διάδρομος ${locationInfo.location.split('-')[0]} → Ράφι ${locationInfo.location.split('-')[1]} → Θέση ${locationInfo.location.split('-')[2]}</p>
                        </div>

                        <div class="screen-action">
                            <button class="action-button">Επόμενο</button>
                        </div>
                    </div>
                </div>`,

                // State B: Επιβεβαίωση Θέσης
                `<h3><i class="fas fa-barcode"></i> Διαδικασία Συλλογής με RFID και Σάρωση Barcode</h3>
                <div class="device-screen">
                    <div class="screen-header">B. Επιβεβαίωση Θέσης</div>
                    <div class="screen-content">
                        <div class="screen-item">
                            <p class="screen-title">Λίστα Συλλογής: PL-2023-4872</p>
                            <p class="screen-subtitle">Εργαζόμενος: Γιώργος Παπαδόπουλος</p>
                        </div>

                        <div class="screen-item">
                            <p class="screen-title">Επιβεβαίωση Θέσης:</p>
                            <p>${locationInfo.product} - ${locationInfo.quantity} τεμάχια</p>
                            <p class="location-path">Διάδρομος ${locationInfo.location.split('-')[0]} → Ράφι ${locationInfo.location.split('-')[1]} → Θέση ${locationInfo.location.split('-')[2]}</p>
                        </div>

                        <div class="screen-action">
                            <button class="action-button">Σάρωση Θέσης</button>
                        </div>
                    </div>
                </div>`,

                // State C: Σάρωση Barcode Προϊόντος
                `<h3><i class="fas fa-barcode"></i> Διαδικασία Συλλογής με RFID και Σάρωση Barcode</h3>
                <div class="device-screen">
                    <div class="screen-header">C. Σάρωση Barcode Προϊόντος</div>
                    <div class="screen-content">
                        <div class="screen-item success-message">
                            <i class="fas fa-check-circle"></i> Η θέση επιβεβαιώθηκε: ${locationInfo.location}
                        </div>

                        <div class="screen-item">
                            <p class="screen-title">Σαρώστε το Barcode του Προϊόντος:</p>
                            <p>${locationInfo.product}</p>
                        </div>

                        <div class="screen-action">
                            <button class="action-button">Σάρωση Προϊόντος</button>
                        </div>
                    </div>
                </div>`,

                // State D: Επιβεβαίωση Ποσότητας
                `<h3><i class="fas fa-barcode"></i> Διαδικασία Συλλογής με RFID και Σάρωση Barcode</h3>
                <div class="device-screen">
                    <div class="screen-header">D. Επιβεβαίωση Ποσότητας</div>
                    <div class="screen-content">
                        <div class="screen-item success-message">
                            <i class="fas fa-check-circle"></i> Το προϊόν επιβεβαιώθηκε: ${locationInfo.product}
                        </div>

                        <div class="screen-item">
                            <p class="screen-title">Ποσότητα προς Συλλογή:</p>
                            <p class="quantity">${locationInfo.quantity} τεμάχια</p>
                            <div class="quantity-control">
                                <label>Επιβεβαίωση Ποσότητας:</label>
                                <div class="quantity-buttons">
                                    <button class="quantity-button">-</button>
                                    <input type="text" value="${locationInfo.quantity - 1}" class="quantity-input">
                                    <button class="quantity-button">+</button>
                                </div>
                            </div>
                        </div>

                        <div class="screen-item warning-message">
                            <i class="fas fa-exclamation-triangle"></i> Η ποσότητα διαφέρει από την αρχική παραγγελία!
                        </div>

                        <div class="screen-action">
                            <button class="action-button success-button">Επιβεβαίωση Αλλαγής</button>
                        </div>
                    </div>
                </div>`,

                // State E: Μετάβαση στην επόμενη θέση
                `<h3><i class="fas fa-barcode"></i> Διαδικασία Συλλογής με RFID και Σάρωση Barcode</h3>
                <div class="device-screen">
                    <div class="screen-header">E. Μετάβαση στην επόμενη θέση</div>
                    <div class="screen-content">
                        <div class="screen-item success-message">
                            <i class="fas fa-check-circle"></i> Η ποσότητα επιβεβαιώθηκε: ${locationInfo.quantity - 1} τεμάχια
                        </div>

                        <div class="screen-item">
                            <p class="screen-title">Επόμενη Θέση:</p>
                            <p class="location-path">Μεταβείτε στην επόμενη θέση της λίστας συλλογής</p>
                        </div>

                        <div class="screen-action">
                            <button class="action-button">Συνέχεια</button>
                        </div>
                    </div>
                </div>`
            ];

            // Show the first state
            dynamicRFIDProcess.innerHTML = rfidStates[0];

            // Automatically progress to the next state after 2 seconds
            // This ensures cards change automatically every 2 seconds
            console.log("RFID process ready - will automatically progress after 2 seconds");

            // Set up automatic progression timer
            setTimeout(() => {
                if (window.progressRFIDState) {
                    console.log("Automatically progressing RFID state after 2 seconds");
                    window.progressRFIDState();
                }
            }, 2000);

            // Store the states in a closure to ensure they're accessible
            const statesForLocation = [...rfidStates]; // Create a copy of the states array

            // Remove any existing event listener to avoid duplicates
            if (dynamicRFIDProcess._rfidClickHandler) {
                dynamicRFIDProcess.removeEventListener('click', dynamicRFIDProcess._rfidClickHandler);
            }

            // Create a click handler for the RFID process
            dynamicRFIDProcess._rfidClickHandler = function(event) {
                // Check if the clicked element is an action button
                if (event.target.classList.contains('action-button')) {
                    console.log("Action button clicked, progressing RFID state");
                    progressRFIDState();
                }
            };

            // Add the click handler to the RFID process element
            dynamicRFIDProcess.addEventListener('click', dynamicRFIDProcess._rfidClickHandler);

            // Define the progressRFIDState function in the global scope
            window.progressRFIDState = function() {
                console.log("progressRFIDState called, current state:", currentRFIDState);
                currentRFIDState++;
                console.log("Moving to next state:", currentRFIDState);

                // If we've gone through all states
                if (currentRFIDState >= statesForLocation.length) {
                    console.log("Completed all RFID states, moving to next point");
                    // Reset state and allow truck to move to next position
                    currentRFIDState = 0;
                    processingLocation = false;

                    // Increment the currentPointIndex to move to the next point
                    currentPointIndex++;

                    // Call moveToNextPoint to continue the animation
                    console.log("Calling moveToNextPoint after 1 second");
                    setTimeout(moveToNextPoint, 1000);
                    return;
                }

                // Update the display with the next state
                console.log("Updating RFID display to state:", currentRFIDState);

                // Add fade-out animation to current content
                const currentContent = dynamicRFIDProcess.querySelector('.device-screen');
                if (currentContent) {
                    currentContent.classList.add('screen-fade-exit');
                    currentContent.classList.add('screen-fade-exit-active');

                    // After animation completes, update content and fade in
                    setTimeout(() => {
                        // Update content
                        dynamicRFIDProcess.innerHTML = statesForLocation[currentRFIDState];

                        // Add fade-in animation to new content
                        const newContent = dynamicRFIDProcess.querySelector('.device-screen');
                        if (newContent) {
                            newContent.classList.add('screen-fade-enter');
                            newContent.classList.add('screen-fade-enter-active');

                            // Remove animation classes after animation completes
                            setTimeout(() => {
                                newContent.classList.remove('screen-fade-enter');
                                newContent.classList.remove('screen-fade-enter-active');
                            }, 300);
                        }
                    }, 300);
                } else {
                    // If no current content, just update
                    dynamicRFIDProcess.innerHTML = statesForLocation[currentRFIDState];
                }

                // Set up timer for next state
                setTimeout(() => {
                    if (window.progressRFIDState) {
                        console.log("Automatically progressing to next RFID state after 2 seconds");
                        window.progressRFIDState();
                    }
                }, 2000);
            };
        }
    }

    function animateTruck(targetX, targetY) {
        const currentX = parseInt(palletTruck.style.left) || routePoints[0].x;
        const currentY = parseInt(palletTruck.style.top) || routePoints[0].y;

        // Calculate distance and duration
        const distance = Math.sqrt(Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2));
        const duration = distance * 10; // 10ms per pixel - faster movement to collection points

        // Set truck orientation for 2D truck
        if (targetX > currentX) {
            palletTruck.style.transform = 'scaleX(1)';
        } else if (targetX < currentX) {
            palletTruck.style.transform = 'scaleX(-1)';
        } else if (targetY < currentY) {
            palletTruck.style.transform = 'rotate(-90deg)';
        } else if (targetY > currentY) {
            palletTruck.style.transform = 'rotate(90deg)';
        }

        // Animate truck movement
        palletTruck.style.transition = `left ${duration}ms linear, top ${duration}ms linear`;
        updateTruckPosition(targetX, targetY);

        // Check if this is a picking location based on the new route points
        // Picking locations are at indices: 2, 3, 4, 5, 9, 10, 11, 15, 16, 17
        const pickingLocations = [2, 3, 4, 5, 9, 10, 11, 15, 16, 17];
        const isPickingLocation = pickingLocations.includes(currentPointIndex);
        console.log("animateTruck - isPickingLocation:", isPickingLocation, "currentPointIndex:", currentPointIndex);

        if (!isPickingLocation) {
            // If this is not a picking location, move to the next point after animation completes
            console.log("animateTruck - Not a picking location, moving to next point after animation completes");
            setTimeout(moveToNextPoint, duration + 2000);
        } else {
            // If this is a picking location, we'll wait for the RFID process to complete
            // before moving to the next point (handled in progressRFIDState)
            console.log("animateTruck - This is a picking location, waiting for RFID process to complete");

            // Special handling for specific collection points if needed
            if (currentPointIndex === 4) {
                console.log("animateTruck - This is the third collection point in Aisle A (index 4)");
            } else if (currentPointIndex === 11) {
                console.log("animateTruck - This is the last collection point in Aisle B (index 11)");
            } else if (currentPointIndex === 17) {
                console.log("animateTruck - This is the final collection point in Aisle C (index 17)");
            }
        }
    }

    function updateTruckPosition(x, y) {
        // Update position for truck
        palletTruck.style.left = `${x}px`;
        palletTruck.style.top = `${y}px`;
    }

    function showPickingAction(x, y, locationIndex) {
        // Create picking action indicator for 2D map
        const pickingAction = document.createElement('div');
        pickingAction.className = 'picking-action';
        pickingAction.style.left = `${x + 30}px`;
        pickingAction.style.top = `${y - 30}px`;
        pickingAction.innerHTML = '<i class="fas fa-hand-paper"></i>';
        warehouseMap.appendChild(pickingAction);

        // Add pulsating animation to the current location
        const productLocations = document.querySelectorAll('.product-location');
        productLocations.forEach(location => {
            location.classList.remove('current-location');
        });

        // Map locationIndex to product location index
        let locationNumber = 0;

        // Aisle A products
        if (locationIndex === 2) {
            locationNumber = 1; // A-12-05
        } else if (locationIndex === 3) {
            locationNumber = 2; // A-14-08
        } else if (locationIndex === 4) {
            locationNumber = 3; // A-16-12
        } else if (locationIndex === 5) {
            locationNumber = 4; // A-18-15
        } 
        // Aisle B products
        else if (locationIndex === 9) {
            locationNumber = 5; // B-05-10
        } else if (locationIndex === 10) {
            locationNumber = 6; // B-07-22
        } else if (locationIndex === 11) {
            locationNumber = 7; // B-09-30
        } 
        // Aisle C products
        else if (locationIndex === 15) {
            locationNumber = 8; // C-01-05
        } else if (locationIndex === 16) {
            locationNumber = 9; // C-03-18
        } else if (locationIndex === 17) {
            locationNumber = 10; // C-05-22
        }

        if (locationNumber > 0) {
            const currentLocation = document.querySelector(`.location-${locationNumber}`);
            if (currentLocation) {
                currentLocation.classList.add('current-location');

                // Show toast notification for location change
                showToast(`Μετάβαση στη θέση ${currentLocation.dataset.location}: ${currentLocation.dataset.product}`, 'info');
            }
        }

        // Map locationIndex to dataIndex based on the new route points
        // Aisle A: locationIndex 2, 3, 4, 5 -> dataIndex 0, 1, 2, 3
        // Aisle B: locationIndex 9, 10, 11 -> dataIndex 4, 5, 6
        // Aisle C: locationIndex 15, 16, 17 -> dataIndex 7, 8, 9
        let dataIndex;

        // Aisle A products
        if (locationIndex === 2) {
            dataIndex = 0; // A-12-05
        } else if (locationIndex === 3) {
            dataIndex = 1; // A-14-08
        } else if (locationIndex === 4) {
            dataIndex = 2; // A-16-12
        } else if (locationIndex === 5) {
            dataIndex = 3; // A-18-15
        } 
        // Aisle B products
        else if (locationIndex === 9) {
            dataIndex = 4; // B-05-10
        } else if (locationIndex === 10) {
            dataIndex = 5; // B-07-22
        } else if (locationIndex === 11) {
            dataIndex = 6; // B-09-30
        } 
        // Aisle C products
        else if (locationIndex === 15) {
            dataIndex = 7; // C-01-05
        } else if (locationIndex === 16) {
            dataIndex = 8; // C-03-18
        } else if (locationIndex === 17) {
            dataIndex = 9; // C-05-22
        } else {
            // Fallback (should not happen)
            dataIndex = 0;
        }

        console.log("Showing picking action at location index:", locationIndex, "data index:", dataIndex, "location data length:", locationData.length);

        // Check if dataIndex is valid
        if (dataIndex >= locationData.length) {
            console.error("Invalid dataIndex:", dataIndex, "for locationIndex:", locationIndex);
            return;
        }

        const locationInfo = locationData[dataIndex];
        console.log("Showing picking action with location info:", locationInfo);
        if (!locationInfo) {
            console.error("locationInfo is null or undefined for dataIndex:", dataIndex);
            return;
        }

        // Update worker details card
        const currentLocation = document.getElementById('current-location');
        const currentProduct = document.getElementById('current-product');
        const currentQuantity = document.getElementById('current-quantity');

        if (currentLocation && currentProduct && currentQuantity && locationInfo) {
            const [aisle, shelf, position] = locationInfo.location.split('-');
            currentLocation.textContent = `Διάδρομος ${aisle}, Ράφι ${shelf}, Θέση ${position}`;
            currentProduct.textContent = locationInfo.product;
            currentQuantity.textContent = `${locationInfo.quantity} τεμάχια`;

            // Add animation to highlight the change
            currentLocation.classList.add('animate__animated', 'animate__flash');
            currentProduct.classList.add('animate__animated', 'animate__flash');
            currentQuantity.classList.add('animate__animated', 'animate__flash');

            // Remove animation classes after animation completes
            setTimeout(() => {
                currentLocation.classList.remove('animate__animated', 'animate__flash');
                currentProduct.classList.remove('animate__animated', 'animate__flash');
                currentQuantity.classList.remove('animate__animated', 'animate__flash');
            }, 1000);
        }

        // Update RFID process dynamically
        updateRFIDProcess(locationIndex);

        // Update document changes - only if the element exists
        const documentChanges = document.getElementById('document-changes');
        if (documentChanges) {
            const pendingItems = documentChanges.querySelectorAll('.change-item.pending');
            if (pendingItems.length > 0 && locationIndex <= pendingItems.length) {
                const itemToUpdate = pendingItems[0];
                itemToUpdate.classList.remove('pending');

                const timeElement = itemToUpdate.querySelector('.change-time');
                const descriptionElement = itemToUpdate.querySelector('.change-description');

                if (timeElement) {
                    const now = new Date();
                    timeElement.textContent = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
                }

                if (descriptionElement && locationInfo) {
                    descriptionElement.textContent = `Συλλέχθηκαν ${locationInfo.quantity} τεμάχια ${locationInfo.description} (${locationInfo.product})`;
                }

                // Add animation to highlight the change
                itemToUpdate.classList.add('animate__animated', 'animate__fadeIn');
                setTimeout(() => {
                    itemToUpdate.classList.remove('animate__animated', 'animate__fadeIn');
                }, 1000);
            }
        }

        // Update progress bar
        const progressBar = document.getElementById('picking-progress');
        const progressPercentage = document.querySelector('.progress-percentage');
        if (progressBar) {
            // Calculate progress based on current location
            // We have 10 locations total, so each location represents 10% progress
            let progress = 0;

            // Map locationIndex to progress percentage based on the new route points
            // Aisle A: locationIndex 2, 3, 4, 5 -> 10%, 20%, 30%, 40%
            // Aisle B: locationIndex 9, 10, 11 -> 50%, 60%, 70%
            // Aisle C: locationIndex 15, 16, 17 -> 80%, 90%, 100%

            // Aisle A products
            if (locationIndex === 2) {
                progress = 10; // A-12-05
            } else if (locationIndex === 3) {
                progress = 20; // A-14-08
            } else if (locationIndex === 4) {
                progress = 30; // A-16-12
            } else if (locationIndex === 5) {
                progress = 40; // A-18-15
            } 
            // Aisle B products
            else if (locationIndex === 9) {
                progress = 50; // B-05-10
            } else if (locationIndex === 10) {
                progress = 60; // B-07-22
            } else if (locationIndex === 11) {
                progress = 70; // B-09-30
            } 
            // Aisle C products
            else if (locationIndex === 15) {
                progress = 80; // C-01-05
            } else if (locationIndex === 16) {
                progress = 90; // C-03-18
            } else if (locationIndex === 17) {
                progress = 100; // C-05-22
            }

            console.log("Setting progress bar to:", progress, "% for locationIndex:", locationIndex);
            progressBar.style.width = `${progress}%`;

            // Update progress percentage text
            if (progressPercentage) {
                progressPercentage.textContent = `${progress}% ολοκληρωμένο`;
            }

            // Show toast notification for progress
            if (progress > 0 && progress % 20 === 0) {
                showToast(`${progress}% της συλλογής ολοκληρώθηκε!`, 'success');
            }

            // Update checkpoints with color indicators
            const checkpoints = document.querySelectorAll('.progress-checkpoint');
            checkpoints.forEach((checkpoint, index) => {
                const checkpointDot = checkpoint.querySelector('.checkpoint-dot');

                // Map locationIndex to checkpoint index based on the new route points
                // Aisle A: locationIndex 2, 3, 4, 5 -> checkpoint index 0, 1, 2, 3
                // Aisle B: locationIndex 9, 10, 11 -> checkpoint index 4, 5, 6
                // Aisle C: locationIndex 15, 16, 17 -> checkpoint index 7, 8, 9
                let checkpointIndex;

                // Convert locationIndex to checkpoint index (0-9)
                if (locationIndex === 2) checkpointIndex = 0;
                else if (locationIndex === 3) checkpointIndex = 1;
                else if (locationIndex === 4) checkpointIndex = 2;
                else if (locationIndex === 5) checkpointIndex = 3;
                else if (locationIndex === 9) checkpointIndex = 4;
                else if (locationIndex === 10) checkpointIndex = 5;
                else if (locationIndex === 11) checkpointIndex = 6;
                else if (locationIndex === 15) checkpointIndex = 7;
                else if (locationIndex === 16) checkpointIndex = 8;
                else if (locationIndex === 17) checkpointIndex = 9;
                else checkpointIndex = -1; // Invalid locationIndex

                console.log("Checkpoint index:", index, "current checkpoint index:", checkpointIndex);

                // Special handling for the final collection point (locationIndex 17)
                if (locationIndex === 17 && index === 9) {
                    // Final checkpoint for the final collection point
                    checkpoint.classList.add('completed');
                    if (checkpointDot) {
                        checkpointDot.style.backgroundColor = 'var(--success-color)';
                        checkpointDot.style.borderColor = 'var(--success-color)';
                    }

                    // Add animation to highlight the change
                    checkpoint.classList.add('animate__animated', 'animate__pulse');
                    setTimeout(() => {
                        checkpoint.classList.remove('animate__animated', 'animate__pulse');
                    }, 1000);
                } else if (index < checkpointIndex) {
                    // Completed checkpoint
                    checkpoint.classList.add('completed');
                    if (checkpointDot) {
                        checkpointDot.style.backgroundColor = 'var(--success-color)';
                        checkpointDot.style.borderColor = 'var(--success-color)';
                    }
                } else if (index === checkpointIndex) {
                    // Current checkpoint
                    checkpoint.classList.add('completed');
                    if (checkpointDot) {
                        checkpointDot.style.backgroundColor = 'var(--warning-color)';
                        checkpointDot.style.borderColor = 'var(--warning-color)';
                    }

                    // Add animation to highlight the change
                    checkpoint.classList.add('animate__animated', 'animate__pulse');
                    setTimeout(() => {
                        checkpoint.classList.remove('animate__animated', 'animate__pulse');
                    }, 1000);
                } else {
                    // Future checkpoint
                    checkpoint.classList.remove('completed');
                    if (checkpointDot) {
                        checkpointDot.style.backgroundColor = '#e9ecef';
                        checkpointDot.style.borderColor = 'var(--primary-color)';
                    }
                }
            });
        }

        // Remove picking action indicator after a delay
        setTimeout(() => {
            pickingAction.remove();
        }, 1500);
    }

    // Global variable to track the current RFID process state
    let currentRFIDState = 0;
    let processingLocation = false;

    // Function to update RFID process dynamically
    function updateRFIDProcess(locationIndex) {
        const dynamicRFIDProcess = document.getElementById('dynamic-rfid-process');
        if (!dynamicRFIDProcess) return;

        // Map locationIndex to dataIndex based on the new route points
        // Aisle A: locationIndex 2, 3, 4, 5 -> dataIndex 0, 1, 2, 3
        // Aisle B: locationIndex 9, 10, 11 -> dataIndex 4, 5, 6
        // Aisle C: locationIndex 15, 16, 17 -> dataIndex 7, 8, 9
        let dataIndex;

        // Aisle A products
        if (locationIndex === 2) {
            dataIndex = 0; // A-12-05
        } else if (locationIndex === 3) {
            dataIndex = 1; // A-14-08
        } else if (locationIndex === 4) {
            dataIndex = 2; // A-16-12
        } else if (locationIndex === 5) {
            dataIndex = 3; // A-18-15
        } 
        // Aisle B products
        else if (locationIndex === 9) {
            dataIndex = 4; // B-05-10
        } else if (locationIndex === 10) {
            dataIndex = 5; // B-07-22
        } else if (locationIndex === 11) {
            dataIndex = 6; // B-09-30
        } 
        // Aisle C products
        else if (locationIndex === 15) {
            dataIndex = 7; // C-01-05
        } else if (locationIndex === 16) {
            dataIndex = 8; // C-03-18
        } else if (locationIndex === 17) {
            dataIndex = 9; // C-05-22
        } else {
            // Fallback (should not happen)
            dataIndex = 0;
        }

        console.log("Updating RFID process at location index:", locationIndex, "data index:", dataIndex, "location data length:", locationData.length);

        // Check if dataIndex is valid
        if (dataIndex >= locationData.length) {
            console.error("Invalid dataIndex:", dataIndex, "for locationIndex:", locationIndex);
            return;
        }

        const locationInfo = locationData[dataIndex];
        console.log("Updating RFID process at location index:", locationIndex, "data index:", dataIndex, "location info:", locationInfo);
        if (!locationInfo) {
            console.error("locationInfo is null or undefined for dataIndex:", dataIndex);
            return;
        }

        // Set flag that we're processing a location
        processingLocation = true;

        // Reset the RFID state to the beginning
        currentRFIDState = 0;

        // Define the different states of the RFID process
        const rfidStates = [
            // State A: Οθόνη Συσκευής RFID
            `<h3><i class="fas fa-barcode"></i> Διαδικασία Συλλογής με RFID και Σάρωση Barcode</h3>
            <div class="device-screen">
                <div class="screen-header">A. Οθόνη Συσκευής RFID</div>
                <div class="screen-content">
                    <div class="screen-item">
                        <p class="screen-title">Λίστα Συλλογής: PL-2023-4872</p>
                        <p class="screen-subtitle">Εργαζόμενος: Γιώργος Παπαδόπουλος</p>
                    </div>

                    <div class="screen-item">
                        <p class="screen-title">Επόμενο Προϊόν:</p>
                        <p>${locationInfo.product} - ${locationInfo.quantity} τεμάχια</p>
                        <p class="location-path">Διάδρομος ${locationInfo.location.split('-')[0]} → Ράφι ${locationInfo.location.split('-')[1]} → Θέση ${locationInfo.location.split('-')[2]}</p>
                    </div>

                    <div class="screen-action">
                        <button class="action-button">Επόμενο</button>
                    </div>
                </div>
            </div>`,

            // State B: Επιβεβαίωση Θέσης
            `<h3><i class="fas fa-barcode"></i> Διαδικασία Συλλογής με RFID και Σάρωση Barcode</h3>
            <div class="device-screen">
                <div class="screen-header">B. Επιβεβαίωση Θέσης</div>
                <div class="screen-content">
                    <div class="screen-item">
                        <p class="screen-title">Λίστα Συλλογής: PL-2023-4872</p>
                        <p class="screen-subtitle">Εργαζόμενος: Γιώργος Παπαδόπουλος</p>
                    </div>

                    <div class="screen-item">
                        <p class="screen-title">Επιβεβαίωση Θέσης:</p>
                        <p>${locationInfo.product} - ${locationInfo.quantity} τεμάχια</p>
                        <p class="location-path">Διάδρομος ${locationInfo.location.split('-')[0]} → Ράφι ${locationInfo.location.split('-')[1]} → Θέση ${locationInfo.location.split('-')[2]}</p>
                    </div>

                    <div class="screen-action">
                        <button class="action-button">Σάρωση Θέσης</button>
                    </div>
                </div>
            </div>`,

            // State C: Σάρωση Barcode Προϊόντος
            `<h3><i class="fas fa-barcode"></i> Διαδικασία Συλλογής με RFID και Σάρωση Barcode</h3>
            <div class="device-screen">
                <div class="screen-header">C. Σάρωση Barcode Προϊόντος</div>
                <div class="screen-content">
                    <div class="screen-item success-message">
                        <i class="fas fa-check-circle"></i> Η θέση επιβεβαιώθηκε: ${locationInfo.location}
                    </div>

                    <div class="screen-item">
                        <p class="screen-title">Σαρώστε το Barcode του Προϊόντος:</p>
                        <p>${locationInfo.product}</p>
                    </div>

                    <div class="screen-action">
                        <button class="action-button">Σάρωση Προϊόντος</button>
                    </div>
                </div>
            </div>`,

            // State D: Επιβεβαίωση Ποσότητας
            `<h3><i class="fas fa-barcode"></i> Διαδικασία Συλλογής με RFID και Σάρωση Barcode</h3>
            <div class="device-screen">
                <div class="screen-header">D. Επιβεβαίωση Ποσότητας</div>
                <div class="screen-content">
                    <div class="screen-item success-message">
                        <i class="fas fa-check-circle"></i> Το προϊόν επιβεβαιώθηκε: ${locationInfo.product}
                    </div>

                    <div class="screen-item">
                        <p class="screen-title">Ποσότητα προς Συλλογή:</p>
                        <p class="quantity">${locationInfo.quantity} τεμάχια</p>
                        <div class="quantity-control">
                            <label>Επιβεβαίωση Ποσότητας:</label>
                            <div class="quantity-buttons">
                                <button class="quantity-button">-</button>
                                <input type="text" value="${locationInfo.quantity - 1}" class="quantity-input">
                                <button class="quantity-button">+</button>
                            </div>
                        </div>
                    </div>

                    <div class="screen-item warning-message">
                        <i class="fas fa-exclamation-triangle"></i> Η ποσότητα διαφέρει από την αρχική παραγγελία!
                        <div class="dropdown-link">
                            <a href="javascript:void(0);" onclick="toggleExplanation(this)">Γιατί διαφέρει; <i class="fas fa-chevron-down"></i></a>
                            <div class="explanation-box" style="display: none;">
                                <p>Το ERP έδειξε ${locationInfo.quantity} τεμ. διαθέσιμα, αλλά βρέθηκαν μόνο ${locationInfo.quantity - 1} στο rack. Ελέγξτε αν υπάρχουν αποθέματα σε γειτονικό rack.</p>
                            </div>
                        </div>
                    </div>

                    <div class="screen-action">
                        <button class="action-button success-button">Επιβεβαίωση Αλλαγής</button>
                    </div>
                </div>
            </div>`,

            // State E: Μετάβαση στην επόμενη θέση
            `<h3><i class="fas fa-barcode"></i> Διαδικασία Συλλογής με RFID και Σάρωση Barcode</h3>
            <div class="device-screen">
                <div class="screen-header">E. Μετάβαση στην επόμενη θέση</div>
                <div class="screen-content">
                    <div class="screen-item success-message">
                        <i class="fas fa-check-circle"></i> Η ποσότητα επιβεβαιώθηκε: ${locationInfo.quantity - 1} τεμάχια
                    </div>

                    <div class="screen-item">
                        <p class="screen-title">Επόμενη Θέση:</p>
                        <p class="location-path">Μεταβείτε στην επόμενη θέση της λίστας συλλογής</p>
                    </div>

                    <div class="screen-action">
                        <button class="action-button">Συνέχεια</button>
                    </div>
                </div>
            </div>`
        ];

        // Show the first state
        dynamicRFIDProcess.innerHTML = rfidStates[0];

        // Automatically progress to the next state after 2 seconds
        // This ensures cards change automatically every 2 seconds
        console.log("RFID process ready - will automatically progress after 2 seconds");

        // Set up automatic progression timer
        setTimeout(() => {
            if (window.progressRFIDState) {
                console.log("Automatically progressing RFID state after 2 seconds");
                window.progressRFIDState();
            }
        }, 2000);

        // Define the global function to progress through the RFID states
        // Store the states in a closure to ensure they're accessible
        const statesForLocation = [...rfidStates]; // Create a copy of the states array

        // Remove any existing event listener to avoid duplicates
        if (dynamicRFIDProcess._rfidClickHandler) {
            dynamicRFIDProcess.removeEventListener('click', dynamicRFIDProcess._rfidClickHandler);
        }

        // Create a click handler for the RFID process
        dynamicRFIDProcess._rfidClickHandler = function(event) {
            // Check if the clicked element is an action button
            if (event.target.classList.contains('action-button')) {
                console.log("Action button clicked, progressing RFID state");
                progressRFIDState();
            }
        };

        // Add the click handler to the RFID process element
        dynamicRFIDProcess.addEventListener('click', dynamicRFIDProcess._rfidClickHandler);

        // Define the progressRFIDState function in the global scope
        window.progressRFIDState = function() {
            console.log("progressRFIDState called, current state:", currentRFIDState, "location index:", locationIndex);
            currentRFIDState++;
            console.log("Moving to next state:", currentRFIDState);

            // If we've gone through all states
            if (currentRFIDState >= statesForLocation.length) {
                console.log("Completed all RFID states, moving to next point");
                // Reset state and allow truck to move to next position
                currentRFIDState = 0;
                processingLocation = false;

                // Special handling for the final collection point (locationIndex 17)
                if (locationIndex === 17) {
                    console.log("Final collection point completed");

                    // Update progress bar to 100%
                    const progressBar = document.getElementById('picking-progress');
                    if (progressBar) {
                        progressBar.style.width = '100%';
                    }

                    // Update checkpoints to mark the final one as completed
                    const checkpoints = document.querySelectorAll('.progress-checkpoint');
                    checkpoints.forEach((checkpoint, index) => {
                        if (index === 9) { // The tenth checkpoint (index 9) corresponds to the final collection point
                            checkpoint.classList.add('completed');
                            const checkpointDot = checkpoint.querySelector('.checkpoint-dot');
                            if (checkpointDot) {
                                checkpointDot.style.backgroundColor = 'var(--success-color)';
                                checkpointDot.style.borderColor = 'var(--success-color)';
                            }
                        }
                    });

                    // For the final collection point, increment currentPointIndex to routePoints.length
                    // This ensures the truck knows the route is complete
                    // Call moveToNextPoint directly to show completion
                    console.log("Final collection point - incrementing currentPointIndex to routePoints.length");
                    currentPointIndex = routePoints.length;
                    setTimeout(moveToNextPoint, 1000);
                    return;
                }

                // For non-final collection points, increment the currentPointIndex to move to the next point
                currentPointIndex++;

                // Call moveToNextPoint to continue the animation
                console.log("Calling moveToNextPoint after 1 second");
                setTimeout(moveToNextPoint, 1000);
                return;
            }

            // Update the display with the next state
            console.log("Updating RFID display to state:", currentRFIDState);

            // Add fade-out animation to current content
            const currentContent = dynamicRFIDProcess.querySelector('.device-screen');
            if (currentContent) {
                currentContent.classList.add('screen-fade-exit');
                currentContent.classList.add('screen-fade-exit-active');

                // After animation completes, update content and fade in
                setTimeout(() => {
                    // Update content
                    dynamicRFIDProcess.innerHTML = statesForLocation[currentRFIDState];

                    // Add fade-in animation to new content
                    const newContent = dynamicRFIDProcess.querySelector('.device-screen');
                    if (newContent) {
                        newContent.classList.add('screen-fade-enter');
                        newContent.classList.add('screen-fade-enter-active');

                        // Remove animation classes after animation completes
                        setTimeout(() => {
                            newContent.classList.remove('screen-fade-enter');
                            newContent.classList.remove('screen-fade-enter-active');
                        }, 300);
                    }
                }, 300);
            } else {
                // If no current content, just update
                dynamicRFIDProcess.innerHTML = statesForLocation[currentRFIDState];
            }

            // Set up timer for next state
            setTimeout(() => {
                if (window.progressRFIDState) {
                    console.log("Automatically progressing to next RFID state after 2 seconds");
                    window.progressRFIDState();
                }
            }, 2000);
        };
    }

    // Add pulse animation keyframes to the document
    if (!document.getElementById('pulse-animation-style')) {
        const style = document.createElement('style');
        style.id = 'pulse-animation-style';
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
                50% { transform: scale(1.05); box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
                100% { transform: scale(1); box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
            }
        `;
        document.head.appendChild(style);
    }

    // Function to show restart button at the final collection point
    function showRestartButton() {
        console.log("Showing restart button at final collection point");

        // Create restart button for 2D map
        const restartButton = document.createElement('button');
        restartButton.className = 'restart-button';
        restartButton.innerHTML = '<i class="fas fa-redo"></i> Επανεκκίνηση';
        restartButton.style.position = 'absolute';

        // Position the button near the final collection point (index 17, which is C-05-22)
        // The final point is at coordinates {x: 300, y: 400}
        restartButton.style.left = `${300 + 30}px`;
        restartButton.style.top = `${400 - 30}px`;

        restartButton.style.zIndex = '1000';
        restartButton.style.padding = '10px 15px';
        restartButton.style.backgroundColor = 'var(--primary-color)';
        restartButton.style.color = 'white';
        restartButton.style.border = 'none';
        restartButton.style.borderRadius = '5px';
        restartButton.style.cursor = 'pointer';
        restartButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        restartButton.style.animation = 'pulse 1.5s infinite';

        // Add click handler to restart the animation
        const restartAnimation = () => {
            console.log("Restart button clicked, restarting animation");

            // Remove restart button
            if (restartButton.parentNode) restartButton.parentNode.removeChild(restartButton);

            // Reset state variables
            currentPointIndex = 0;
            currentRFIDState = 0;
            processingLocation = false;

            // Reset truck position
            updateTruckPosition(routePoints[0].x, routePoints[0].y);
            console.log("Truck position reset to start");

            // Reset all progress indicators
            resetProgressIndicators();
            console.log("Progress indicators reset");

            // Start the animation again after a short delay
            console.log("Starting animation again with delay of 2000ms");
            setTimeout(moveToNextPoint, 2000);
        };

        restartButton.addEventListener('click', restartAnimation);

        // Add button to the map
        warehouseMap.appendChild(restartButton);
    }

    // Start the animation with increased initial delay
    console.log("Starting animation with initial delay of 3000ms");
    setTimeout(function() {
        console.log("Initial delay completed, calling moveToNextPoint");
        moveToNextPoint();
    }, 3000);

    // Set up interval to check for stuck processing locations
    console.log("Setting up interval to check for stuck processing locations (30000ms)");
    setInterval(() => {
        console.log("Checking if processing is stuck");

        // We no longer automatically restart the animation when it completes
        // The restart is now handled by the restart button
        if (currentPointIndex >= routePoints.length) {
            console.log("Animation has completed. Waiting for restart button click.");
            // Do nothing - wait for restart button click
        } 
        // If we're stuck at a processing location for too long, continue to the next point
        else if (processingLocation) {
            console.log("Processing location for too long, continuing to next point");

            // If we're stuck at an RFID process, show each remaining state sequentially
            if (currentRFIDState > 0) {
                console.log("Showing remaining RFID states sequentially");
                // Get the dynamic RFID process element
                const dynamicRFIDProcess = document.getElementById('dynamic-rfid-process');
                if (dynamicRFIDProcess) {
                    // Map currentPointIndex to dataIndex based on the new route points
                    // Aisle A: currentPointIndex 2, 3, 4, 5 -> dataIndex 0, 1, 2, 3
                    // Aisle B: currentPointIndex 9, 10, 11 -> dataIndex 4, 5, 6
                    // Aisle C: currentPointIndex 15, 16, 17 -> dataIndex 7, 8, 9
                    let dataIndex;

                    // Aisle A products
                    if (currentPointIndex === 2) {
                        dataIndex = 0; // A-12-05
                    } else if (currentPointIndex === 3) {
                        dataIndex = 1; // A-14-08
                    } else if (currentPointIndex === 4) {
                        dataIndex = 2; // A-16-12
                    } else if (currentPointIndex === 5) {
                        dataIndex = 3; // A-18-15
                    } 
                    // Aisle B products
                    else if (currentPointIndex === 9) {
                        dataIndex = 4; // B-05-10
                    } else if (currentPointIndex === 10) {
                        dataIndex = 5; // B-07-22
                    } else if (currentPointIndex === 11) {
                        dataIndex = 6; // B-09-30
                    } 
                    // Aisle C products
                    else if (currentPointIndex === 15) {
                        dataIndex = 7; // C-01-05
                    } else if (currentPointIndex === 16) {
                        dataIndex = 8; // C-03-18
                    } else if (currentPointIndex === 17) {
                        dataIndex = 9; // C-05-22
                    } else {
                        // Fallback (should not happen)
                        dataIndex = 0;
                    }

                    console.log("Interval check - current point index:", currentPointIndex, "data index:", dataIndex, "location data length:", locationData.length);

                    // Check if dataIndex is valid
                    if (dataIndex >= locationData.length) {
                        console.error("Interval check - Invalid dataIndex:", dataIndex, "for currentPointIndex:", currentPointIndex);
                        return;
                    }

                    const locationInfo = locationData[dataIndex];
                    console.log("Interval check - location info:", locationInfo);
                    if (!locationInfo) {
                        console.error("Interval check - locationInfo is null or undefined for dataIndex:", dataIndex);
                        return;
                    }

                    // Recreate the RFID states with the current location data
                    const currentRfidStates = [
                        // State A: Οθόνη Συσκευής RFID
                        `<h3><i class="fas fa-barcode"></i> Διαδικασία Συλλογής με RFID και Σάρωση Barcode</h3>
                        <div class="device-screen">
                            <div class="screen-header">A. Οθόνη Συσκευής RFID</div>
                            <div class="screen-content">
                                <div class="screen-item">
                                    <p class="screen-title">Λίστα Συλλογής: PL-2023-4872</p>
                                    <p class="screen-subtitle">Εργαζόμενος: Γιώργος Παπαδόπουλος</p>
                                </div>

                                <div class="screen-item">
                                    <p class="screen-title">Επόμενο Προϊόν:</p>
                                    <p>${locationInfo.product} - ${locationInfo.quantity} τεμάχια</p>
                                    <p class="location-path">Διάδρομος ${locationInfo.location.split('-')[0]} → Ράφι ${locationInfo.location.split('-')[1]} → Θέση ${locationInfo.location.split('-')[2]}</p>
                                </div>

                                <div class="screen-action">
                                    <button class="action-button">Επόμενο</button>
                                </div>
                            </div>
                        </div>`,

                        // State B: Επιβεβαίωση Θέσης
                        `<h3><i class="fas fa-barcode"></i> Διαδικασία Συλλογής με RFID και Σάρωση Barcode</h3>
                        <div class="device-screen">
                            <div class="screen-header">B. Επιβεβαίωση Θέσης</div>
                            <div class="screen-content">
                                <div class="screen-item">
                                    <p class="screen-title">Λίστα Συλλογής: PL-2023-4872</p>
                                    <p class="screen-subtitle">Εργαζόμενος: Γιώργος Παπαδόπουλος</p>
                                </div>

                                <div class="screen-item">
                                    <p class="screen-title">Επιβεβαίωση Θέσης:</p>
                                    <p>${locationInfo.product} - ${locationInfo.quantity} τεμάχια</p>
                                    <p class="location-path">Διάδρομος ${locationInfo.location.split('-')[0]} → Ράφι ${locationInfo.location.split('-')[1]} → Θέση ${locationInfo.location.split('-')[2]}</p>
                                </div>

                                <div class="screen-action">
                                    <button class="action-button">Σάρωση Θέσης</button>
                                </div>
                            </div>
                        </div>`,

                        // State C: Σάρωση Barcode Προϊόντος
                        `<h3><i class="fas fa-barcode"></i> Διαδικασία Συλλογής με RFID και Σάρωση Barcode</h3>
                        <div class="device-screen">
                            <div class="screen-header">C. Σάρωση Barcode Προϊόντος</div>
                            <div class="screen-content">
                                <div class="screen-item success-message">
                                    <i class="fas fa-check-circle"></i> Η θέση επιβεβαιώθηκε: ${locationInfo.location}
                                </div>

                                <div class="screen-item">
                                    <p class="screen-title">Σαρώστε το Barcode του Προϊόντος:</p>
                                    <p>${locationInfo.product}</p>
                                </div>

                                <div class="screen-action">
                                    <button class="action-button">Σάρωση Προϊόντος</button>
                                </div>
                            </div>
                        </div>`,

                        // State D: Επιβεβαίωση Ποσότητας
                        `<h3><i class="fas fa-barcode"></i> Διαδικασία Συλλογής με RFID και Σάρωση Barcode</h3>
                        <div class="device-screen">
                            <div class="screen-header">D. Επιβεβαίωση Ποσότητας</div>
                            <div class="screen-content">
                                <div class="screen-item success-message">
                                    <i class="fas fa-check-circle"></i> Το προϊόν επιβεβαιώθηκε: ${locationInfo.product}
                                </div>

                                <div class="screen-item">
                                    <p class="screen-title">Ποσότητα προς Συλλογή:</p>
                                    <p class="quantity">${locationInfo.quantity} τεμάχια</p>
                                    <div class="quantity-control">
                                        <label>Επιβεβαίωση Ποσότητας:</label>
                                        <div class="quantity-buttons">
                                            <button class="quantity-button">-</button>
                                            <input type="text" value="${locationInfo.quantity - 1}" class="quantity-input">
                                            <button class="quantity-button">+</button>
                                        </div>
                                    </div>
                                </div>

                                <div class="screen-item warning-message">
                                    <i class="fas fa-exclamation-triangle"></i> Η ποσότητα διαφέρει από την αρχική παραγγελία!
                                    <div class="dropdown-link">
                                        <a href="javascript:void(0);" onclick="toggleExplanation(this)">Γιατί διαφέρει; <i class="fas fa-chevron-down"></i></a>
                                        <div class="explanation-box" style="display: none;">
                                            <p>Το ERP έδειξε ${locationInfo.quantity} τεμ. διαθέσιμα, αλλά βρέθηκαν μόνο ${locationInfo.quantity - 1} στο rack. Ελέγξτε αν υπάρχουν αποθέματα σε γειτονικό rack.</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="screen-action">
                                    <button class="action-button success-button">Επιβεβαίωση Αλλαγής</button>
                                </div>
                            </div>
                        </div>`,

                        // State E: Μετάβαση στην επόμενη θέση
                        `<h3><i class="fas fa-barcode"></i> Διαδικασία Συλλογής με RFID και Σάρωση Barcode</h3>
                        <div class="device-screen">
                            <div class="screen-header">E. Μετάβαση στην επόμενη θέση</div>
                            <div class="screen-content">
                                <div class="screen-item success-message">
                                    <i class="fas fa-check-circle"></i> Η ποσότητα επιβεβαιώθηκε: ${locationInfo.quantity - 1} τεμάχια
                                </div>

                                <div class="screen-item">
                                    <p class="screen-title">Επόμενη Θέση:</p>
                                    <p class="location-path">Μεταβείτε στην επόμενη θέση της λίστας συλλογής</p>
                                </div>

                                <div class="screen-action">
                                    <button class="action-button">Συνέχεια</button>
                                </div>
                            </div>
                        </div>`
                    ];

                    // Show each remaining state with a delay between them
                    function showRemainingStates(stateIndex) {
                        if (stateIndex >= currentRfidStates.length) {
                            // All states have been shown, now complete the process
                            console.log("All RFID states have been shown, completing process");
                            // Reset state and allow truck to move to next position
                            currentRFIDState = 0;
                            processingLocation = false;

                            // Increment the currentPointIndex to move to the next point
                            currentPointIndex++;

                            // Call moveToNextPoint to continue the animation
                            console.log("Moving to next point after completing RFID process");
                            setTimeout(moveToNextPoint, 1000);
                            return;
                        }

                        // Update the display with the current state
                        console.log("Automatically showing RFID state:", stateIndex);
                        dynamicRFIDProcess.innerHTML = currentRfidStates[stateIndex];

                        // Move to the next state after a delay
                        setTimeout(() => {
                            showRemainingStates(stateIndex + 1);
                        }, 2000); // Show each state for 2 seconds
                    }

                    // Start showing states from the current state
                    showRemainingStates(currentRFIDState);
                }
            }
        }
    }, 30000); // Check every 30 seconds to give users more time to interact with each card
}

// Tab Navigation Function
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (tabButtons.length === 0) {
        console.error("No tab buttons found");
        return; // Exit if no tab buttons found
    }

    console.log(`Found ${tabButtons.length} tab buttons and ${tabPanes.length} tab panes`);

    // Remove any existing click event listeners to avoid duplicates
    tabButtons.forEach(button => {
        button.removeEventListener('click', handleTabClick);
        // Ensure the button is clickable
        button.style.pointerEvents = 'auto';
        button.style.cursor = 'pointer';
    });

    // Add click event listeners to each button
    tabButtons.forEach(button => {
        button.addEventListener('click', handleTabClick);
    });

    // Function to handle tab click events
    function handleTabClick(event) {
        // Prevent default behavior
        event.preventDefault();

        // Get the clicked button
        const button = event.currentTarget;

        // Get the tab ID from the data-tab attribute
        const tabId = button.getAttribute('data-tab');
        console.log(`Tab clicked: ${tabId}`);

        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        // Add active class to the clicked button and corresponding pane
        button.classList.add('active');
        const tabPane = document.getElementById(tabId);
        if (tabPane) {
            tabPane.classList.add('active');

            // Add animation to the cards in the active tab
            const cards = tabPane.querySelectorAll('.procedure-card');
            console.log(`Found ${cards.length} cards in tab ${tabId}`);
            cards.forEach((card, index) => {
                card.classList.remove('animate__fadeInUp');
                void card.offsetWidth; // Trigger reflow to restart animation
                card.classList.add('animate__fadeInUp');
                card.style.animationDelay = `${index * 0.1}s`;
            });
        } else {
            console.error(`Tab pane with ID ${tabId} not found`);
        }
    }
}

// Toast notification function
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Add appropriate icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    if (type === 'error') icon = 'times-circle';

    toast.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;

    // Add to container
    toastContainer.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Initialize rack tooltips
function initRackTooltips() {
    const productLocations = document.querySelectorAll('.product-location');
    const tooltip = document.getElementById('rack-tooltip');

    if (!productLocations.length || !tooltip) return;

    productLocations.forEach(location => {
        location.addEventListener('mouseenter', (e) => {
            const locationData = e.target.dataset.location;
            const productData = e.target.dataset.product;
            const quantityData = e.target.dataset.quantity;
            const descriptionData = e.target.dataset.description;

            tooltip.innerHTML = `
                <strong>Θέση:</strong> ${locationData}<br>
                <strong>Προϊόν:</strong> ${productData}<br>
                <strong>Περιγραφή:</strong> ${descriptionData}<br>
                <strong>Ποσότητα:</strong> ${quantityData} τεμ.
            `;

            const rect = e.target.getBoundingClientRect();
            const mapRect = document.getElementById('warehouse-map').getBoundingClientRect();

            tooltip.style.left = `${rect.left + rect.width/2 - mapRect.left}px`;
            tooltip.style.top = `${rect.top - 10 - mapRect.top}px`;
            tooltip.style.opacity = '1';
        });

        location.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });

        // Add click handler for rack locations
        location.addEventListener('click', (e) => {
            const locationData = e.target.dataset.location;
            const productData = e.target.dataset.product;

            // Remove current class from all locations
            productLocations.forEach(loc => loc.classList.remove('current'));

            // Add current class to clicked location
            e.target.classList.add('current');

            // Show confirmation modal
            showConfirmationModal(locationData, productData);
        });
    });
}

// Show confirmation modal for rack redirection
function showConfirmationModal(location, product) {
    // Create modal if it doesn't exist
    let modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.remove();
    }

    modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    modalOverlay.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Επιβεβαίωση Αλλαγής Διαδρομής</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>Θέλετε να παραλείψετε τα προηγούμενα racks και να μεταβείτε απευθείας στη θέση ${location} (${product}); Η διαδρομή θα επανυπολογιστεί αυτόματα.</p>
            </div>
            <div class="modal-footer">
                <button class="modal-button secondary modal-close">Άκυρο</button>
                <button class="modal-button primary" id="confirm-redirect">Επιβεβαίωση</button>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Add event listeners
    modalOverlay.querySelector('.modal-close').addEventListener('click', () => {
        modalOverlay.remove();
        // Remove current class from all locations
        document.querySelectorAll('.product-location').forEach(loc => loc.classList.remove('current'));
    });

    modalOverlay.querySelector('#confirm-redirect').addEventListener('click', () => {
        // Show success toast
        showToast(`Η διαδρομή επανυπολογίστηκε. Μετάβαση στη θέση ${location}.`, 'success');

        // Close modal
        modalOverlay.remove();
    });
}

// Toggle explanation dropdown
function toggleExplanation(element) {
    const explanationBox = element.nextElementSibling;
    const icon = element.querySelector('i');

    if (explanationBox.style.display === 'none') {
        explanationBox.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        explanationBox.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}

// Initialize warehouse map when on any procedure page
if (window.location.pathname.includes('/procedures/')) {
    console.log("Warehouse map initialization condition met");
    window.addEventListener('load', function() {
        console.log("Window loaded, initializing warehouse map");
        initWarehouseMap();

        // Initialize rack tooltips
        initRackTooltips();

        // Show welcome toast
        setTimeout(() => {
            showToast('Καλώς ήρθατε, Γιώργο! Η λίστα συλλογής είναι έτοιμη.', 'success');
        }, 1000);

        // Add connectivity status toggle for demo
        const connectivityStatus = document.querySelector('.connectivity-status');
        if (connectivityStatus) {
            connectivityStatus.addEventListener('click', () => {
                if (connectivityStatus.classList.contains('online')) {
                    connectivityStatus.classList.remove('online');
                    connectivityStatus.classList.add('offline');
                    connectivityStatus.innerHTML = '<i class="fas fa-wifi"></i> Σύνδεση: Offline';
                    showToast('Η σύνδεση στο δίκτυο χάθηκε. Τα δεδομένα αποθηκεύονται τοπικά.', 'warning');
                } else {
                    connectivityStatus.classList.remove('offline');
                    connectivityStatus.classList.add('online');
                    connectivityStatus.innerHTML = '<i class="fas fa-wifi"></i> Σύνδεση: Online';
                    showToast('Η σύνδεση στο δίκτυο αποκαταστάθηκε. Τα δεδομένα συγχρονίστηκαν.', 'success');
                }
            });
        }
    });
} else {
    console.log("Warehouse map initialization condition not met");
    console.log("Path:", window.location.pathname);
}

// Initialize receiving process
function initReceivingProcess() {
    console.log("Initializing receiving process");

    // Variables to track the current state of the receiving process
    let currentReceivingStep = 0;
    let processingReceiving = false;

    // Get DOM elements
    const forklift = document.getElementById('forklift');
    const receivingProgress = document.getElementById('receiving-progress');
    const progressPercentage = document.querySelector('.progress-percentage');
    const checkpoints = document.querySelectorAll('.progress-checkpoint');
    const dynamicReceivingProcess = document.getElementById('dynamic-receiving-process');
    const stepA = document.getElementById('stepA');
    const stepB = document.getElementById('stepB');
    const stepC = document.getElementById('stepC');
    const stepD = document.getElementById('stepD');

    // Define receiving route points
    const receivingRoutePoints = [
        { x: 280, y: 65 },    // Start at Dock Door 3
        { x: 280, y: 200 },   // Move to Quality Control Area
        { x: 280, y: 350 },   // Move to Staging Area
        { x: 280, y: 470 }    // Move to Rack Area (R8)
    ];

    // Initialize the receiving process
    function startReceivingProcess() {
        console.log("Starting receiving process");

        // Reset progress indicators
        resetReceivingProgress();

        // Start the forklift animation
        moveForkliftToNextPoint();
    }

    // Reset progress indicators
    function resetReceivingProgress() {
        console.log("Resetting receiving progress");

        // Reset progress bar
        if (receivingProgress) {
            receivingProgress.style.width = '0%';
        }

        // Reset progress percentage
        if (progressPercentage) {
            progressPercentage.textContent = '0% ολοκληρωμένο';
        }

        // Reset checkpoints
        if (checkpoints) {
            checkpoints.forEach(checkpoint => {
                checkpoint.classList.remove('completed');

                // Reset checkpoint dot colors
                const checkpointDot = checkpoint.querySelector('.checkpoint-dot');
                if (checkpointDot) {
                    checkpointDot.style.backgroundColor = '#e9ecef';
                    checkpointDot.style.borderColor = 'var(--primary-color)';
                }
            });
        }

        // Reset wizard steps
        if (stepA) stepA.style.display = 'block';
        if (stepB) stepB.style.display = 'none';
        if (stepC) stepC.style.display = 'none';
        if (stepD) stepD.style.display = 'none';

        // Reset state variables
        currentReceivingStep = 0;
        processingReceiving = false;
    }

    // Move forklift to next point in the route
    function moveForkliftToNextPoint() {
        console.log("Moving forklift to next point, currentReceivingStep:", currentReceivingStep);

        // If we're currently processing a location, wait and check again later
        if (processingReceiving) {
            console.log("Processing receiving, waiting 1 second before checking again");
            setTimeout(moveForkliftToNextPoint, 1000);
            return;
        }

        // Check if we've reached the end of the route
        if (currentReceivingStep >= receivingRoutePoints.length) {
            console.log("Route complete, stopping at final point");
            return;
        }

        const targetPoint = receivingRoutePoints[currentReceivingStep];
        console.log("Moving to point:", currentReceivingStep, "coordinates:", targetPoint.x, targetPoint.y);
        animateForklift(targetPoint.x, targetPoint.y);

        // Check if this is a receiving action point
        if (currentReceivingStep === 0) {
            // At Dock Door 3 - Show Step A
            showReceivingAction(targetPoint.x, targetPoint.y, 'A');
        } else if (currentReceivingStep === 1) {
            // At Quality Control Area - Show Step B
            showReceivingAction(targetPoint.x, targetPoint.y, 'B');
        } else if (currentReceivingStep === 2) {
            // At Staging Area - Show Step C
            showReceivingAction(targetPoint.x, targetPoint.y, 'C');
        } else if (currentReceivingStep === 3) {
            // At Rack Area - Show Step D
            showReceivingAction(targetPoint.x, targetPoint.y, 'D');
        } else {
            // If this is not a receiving action point, continue to the next point
            currentReceivingStep++;
        }
    }

    // Animate forklift movement
    function animateForklift(targetX, targetY) {
        const currentX = parseInt(forklift.style.left) || receivingRoutePoints[0].x;
        const currentY = parseInt(forklift.style.top) || receivingRoutePoints[0].y;

        // Calculate distance and duration
        const distance = Math.sqrt(Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2));
        const duration = distance * 10; // 10ms per pixel

        // Set forklift orientation
        if (targetX > currentX) {
            forklift.style.transform = 'scaleX(1)';
        } else if (targetX < currentX) {
            forklift.style.transform = 'scaleX(-1)';
        } else if (targetY < currentY) {
            forklift.style.transform = 'rotate(-90deg)';
        } else if (targetY > currentY) {
            forklift.style.transform = 'rotate(90deg)';
        }

        // Animate forklift movement
        forklift.style.transition = `left ${duration}ms linear, top ${duration}ms linear`;
        updateForkliftPosition(targetX, targetY);

        // If this is not a receiving action point, move to the next point after animation completes
        if (currentReceivingStep === 0 || currentReceivingStep === 1 || currentReceivingStep === 2 || currentReceivingStep === 3) {
            // If this is a receiving action point, we'll wait for the receiving process to complete
            console.log("This is a receiving action point, waiting for receiving process to complete");
        } else {
            console.log("This is not a receiving action point, moving to next point after animation completes");
            setTimeout(moveForkliftToNextPoint, duration + 1000);
        }
    }

    // Update forklift position
    function updateForkliftPosition(x, y) {
        forklift.style.left = `${x}px`;
        forklift.style.top = `${y}px`;
    }

    // Show receiving action at a specific location
    function showReceivingAction(x, y, step) {
        console.log("Showing receiving action for step:", step);

        // Set processingReceiving flag to true
        processingReceiving = true;

        // Create receiving action indicator
        const receivingAction = document.createElement('div');
        receivingAction.className = 'picking-action';
        receivingAction.style.left = `${x + 30}px`;
        receivingAction.style.top = `${y - 30}px`;
        receivingAction.innerHTML = '<i class="fas fa-hand-paper"></i>';
        document.getElementById('receiving-map').appendChild(receivingAction);

        // Show toast notification for location change
        let locationName = '';
        if (step === 'A') {
            locationName = 'Dock Door 3';
        } else if (step === 'B') {
            locationName = 'Ζώνη Ελέγχου';
        } else if (step === 'C') {
            locationName = 'Ζώνη Αναμονής Παλετών';
        } else if (step === 'D') {
            locationName = 'Ράφι R8';
        }
        showToast(`Μετάβαση στη θέση ${locationName}`, 'info');

        // Update the current location in the worker details card
        const currentLocation = document.getElementById('current-location');
        if (currentLocation) {
            currentLocation.textContent = locationName;
        }

        // Update the wizard step
        updateReceivingStep(step);
    }

    // Update the receiving step
    function updateReceivingStep(step) {
        console.log("Updating receiving step to:", step);

        // Hide all steps
        if (stepA) stepA.style.display = 'none';
        if (stepB) stepB.style.display = 'none';
        if (stepC) stepC.style.display = 'none';
        if (stepD) stepD.style.display = 'none';

        // Show the current step
        if (step === 'A' && stepA) {
            stepA.style.display = 'block';
            updateProgressBar(0);
        } else if (step === 'B' && stepB) {
            stepB.style.display = 'block';
            updateProgressBar(25);
        } else if (step === 'C' && stepC) {
            stepC.style.display = 'block';
            updateProgressBar(50);
        } else if (step === 'D' && stepD) {
            stepD.style.display = 'block';
            updateProgressBar(75);
        }

        // Add event listeners to the action buttons
        const actionButton = document.querySelector(`#step${step} .action-button`);
        if (actionButton) {
            // Remove any existing event listeners
            const newActionButton = actionButton.cloneNode(true);
            actionButton.parentNode.replaceChild(newActionButton, actionButton);

            // Add new event listener
            newActionButton.addEventListener('click', () => {
                console.log(`Action button clicked for step ${step}`);
                completeReceivingStep(step);
            });
        }
    }

    // Complete the current receiving step
    function completeReceivingStep(step) {
        console.log("Completing receiving step:", step);

        // Update the progress bar
        if (step === 'A') {
            updateProgressBar(25);
            // Mark the checkpoint as completed
            if (checkpoints && checkpoints[0]) {
                checkpoints[0].classList.add('completed');
                const checkpointDot = checkpoints[0].querySelector('.checkpoint-dot');
                if (checkpointDot) {
                    checkpointDot.style.backgroundColor = 'var(--success-color)';
                    checkpointDot.style.borderColor = 'var(--success-color)';
                }
            }
            // Show success toast
            showToast('Το Δελτίο Παραλαβής φορτώθηκε επιτυχώς στο RF Gun', 'success');
            // Increment the current step
            currentReceivingStep++;
            // Set processingReceiving flag to false
            processingReceiving = false;
            // Move to the next point
            setTimeout(moveForkliftToNextPoint, 1000);
        } else if (step === 'B') {
            updateProgressBar(50);
            // Mark the checkpoint as completed
            if (checkpoints && checkpoints[1]) {
                checkpoints[1].classList.add('completed');
                const checkpointDot = checkpoints[1].querySelector('.checkpoint-dot');
                if (checkpointDot) {
                    checkpointDot.style.backgroundColor = 'var(--success-color)';
                    checkpointDot.style.borderColor = 'var(--success-color)';
                }
            }
            // Show success toast
            showToast('Η παλέτα σαρώθηκε επιτυχώς και η ποσότητα επιβεβαιώθηκε', 'success');
            // Increment the current step
            currentReceivingStep++;
            // Set processingReceiving flag to false
            processingReceiving = false;
            // Move to the next point
            setTimeout(moveForkliftToNextPoint, 1000);
        } else if (step === 'C') {
            updateProgressBar(75);
            // Mark the checkpoint as completed
            if (checkpoints && checkpoints[2]) {
                checkpoints[2].classList.add('completed');
                const checkpointDot = checkpoints[2].querySelector('.checkpoint-dot');
                if (checkpointDot) {
                    checkpointDot.style.backgroundColor = 'var(--success-color)';
                    checkpointDot.style.borderColor = 'var(--success-color)';
                }
            }
            // Show success toast
            showToast('Το label της παλέτας εκτυπώθηκε επιτυχώς', 'success');
            // Increment the current step
            currentReceivingStep++;
            // Set processingReceiving flag to false
            processingReceiving = false;
            // Move to the next point
            setTimeout(moveForkliftToNextPoint, 1000);
        } else if (step === 'D') {
            updateProgressBar(100);
            // Mark the checkpoint as completed
            if (checkpoints && checkpoints[3]) {
                checkpoints[3].classList.add('completed');
                const checkpointDot = checkpoints[3].querySelector('.checkpoint-dot');
                if (checkpointDot) {
                    checkpointDot.style.backgroundColor = 'var(--success-color)';
                    checkpointDot.style.borderColor = 'var(--success-color)';
                }
            }
            // Show success toast
            showToast('Η παραλαβή ολοκληρώθηκε επιτυχώς και το ERP ενημερώθηκε', 'success');
            // Increment the current step
            currentReceivingStep++;
            // Set processingReceiving flag to false
            processingReceiving = false;
            // Process is complete, no need to move to the next point
        }
    }

    // Update the progress bar
    function updateProgressBar(percentage) {
        console.log("Updating progress bar to:", percentage);

        // Update the progress bar width
        if (receivingProgress) {
            receivingProgress.style.width = `${percentage}%`;
        }

        // Update the progress percentage text
        if (progressPercentage) {
            progressPercentage.textContent = `${percentage}% ολοκληρωμένο`;
        }
    }

    // Start the receiving process
    startReceivingProcess();

    // Add event listeners to the dock doors
    const dockDoors = document.querySelectorAll('.dock-door');
    dockDoors.forEach(door => {
        door.addEventListener('mouseenter', () => {
            const doorId = door.id.split('-')[1];
            const tooltip = document.createElement('div');
            tooltip.className = 'rack-tooltip';
            tooltip.style.position = 'absolute';
            tooltip.style.top = `${parseInt(door.style.top) - 40}px`;
            tooltip.style.left = `${parseInt(door.style.left)}px`;
            tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '5px 10px';
            tooltip.style.borderRadius = '5px';
            tooltip.style.zIndex = '100';
            tooltip.style.pointerEvents = 'none';
            tooltip.innerHTML = `Dock/Door #${doorId} – Barcode: DCK-0${doorId} – Αριθμός Παλέτας: PAL-321`;
            document.getElementById('receiving-map').appendChild(tooltip);
        });

        door.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.rack-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });

    // Add event listeners to the racks
    const racks = document.querySelectorAll('.rack');
    racks.forEach(rack => {
        rack.addEventListener('mouseenter', () => {
            const rackId = rack.id.split('-')[1];
            const tooltip = document.createElement('div');
            tooltip.className = 'rack-tooltip';
            tooltip.style.position = 'absolute';
            tooltip.style.top = `${parseInt(rack.style.top) - 40}px`;
            tooltip.style.left = `${parseInt(rack.style.left)}px`;
            tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '5px 10px';
            tooltip.style.borderRadius = '5px';
            tooltip.style.zIndex = '100';
            tooltip.style.pointerEvents = 'none';
            tooltip.innerHTML = `Rack R${rackId} – Συνιστώμενη τοποθέτηση VID-TB-150`;
            document.getElementById('receiving-map').appendChild(tooltip);
        });

        rack.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.rack-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}
