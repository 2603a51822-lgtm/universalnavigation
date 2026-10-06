// =====================================================
// UNIVERSAL NAVIGATION
// OUTDOOR + INDOOR CAMPUS NAVIGATION
// =====================================================


// =====================================================
// MAIN LOCATIONS
// =====================================================

const collegeLocation = [18.093258, 79.469761];

// Prototype/demo hospital coordinate
const hospitalLocation = [18.095, 79.475];


// =====================================================
// CAMPUS DATABASE
// =====================================================

const campusData = [

    {
        name: "Admission Building",
        block: "Block 1",
        keywords: [
            "admission",
            "admission building",
            "block 1",
            "hod"
        ],
        details: [
            "Ground Floor: Admission Building",
            "1st Floor: General/Vacant Classrooms",
            "1st Floor: HOD Office"
        ]
    },

    {
        name: "ECE / Civil / EE",
        block: "Block 2",
        keywords: [
            "ece",
            "civil",
            "ee",
            "electrical",
            "block 2"
        ],
        details: [
            "ECE Department",
            "Civil Department",
            "EE Department"
        ]
    },

    {
        name: "Designing Area",
        block: "Block 3",
        keywords: [
            "designing",
            "design",
            "block 3"
        ],
        details: [
            "Ground Floor: Designing",
            "1st Floor: Physics Lab",
            "2nd Floor: Physics Lab"
        ]
    },

    {
        name: "Canteen",
        block: "Block 7",
        keywords: [
            "canteen",
            "food",
            "block 7"
        ],
        details: [
            "Ground Floor: Canteen",
            "1st Floor: CSE / IoT Classes",
            "2nd Floor: General Classes"
        ]
    },

    {
        name: "CSE Block",
        block: "Block 8",
        keywords: [
            "cse",
            "block 8",
            "python lab 8",
            "lecture hall 8"
        ],
        details: [
            "Ground Floor: Python Lab",
            "1st Floor: Lecture Hall",
            "2nd Floor: Python Lab + Lecture Hall"
        ]
    },

    {
        name: "CSE Block",
        block: "Block 10",
        keywords: [
            "cse",
            "block 10",
            "python lab 10",
            "lecture hall 10"
        ],
        details: [
            "Ground Floor: Python Lab",
            "1st Floor: Lecture Hall",
            "2nd Floor: Python Lab + Lecture Hall"
        ]
    },

    {
        name: "CSE Block",
        block: "Block 11",
        keywords: [
            "cse",
            "block 11",
            "python lab 11",
            "lecture hall 11"
        ],
        details: [
            "Ground Floor: Python Lab",
            "1st Floor: Lecture Hall",
            "2nd Floor: Python Lab + Lecture Hall"
        ]
    }

];


// =====================================================
// MAP
// =====================================================

const map = L.map("map").setView(
    collegeLocation,
    16
);


L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            "&copy; OpenStreetMap contributors"
    }
).addTo(map);


// =====================================================
// MARKERS
// =====================================================

const collegeMarker =
    L.marker(collegeLocation)
        .addTo(map)
        .bindPopup(
            "<b>🏫 SR University</b><br>Warangal, Telangana"
        );


const hospitalMarker =
    L.marker(hospitalLocation)
        .addTo(map)
        .bindPopup(
            "<b>🏥 Hospital</b><br>Prototype location"
        );


// =====================================================
// VARIABLES
// =====================================================

let userMarker = null;

let routingControl = null;

let watchId = null;

let currentDestination =
    collegeLocation;


// =====================================================
// UI ELEMENTS
// =====================================================

const distanceElement =
    document.getElementById("distance");

const timeElement =
    document.getElementById("time");

const statusElement =
    document.getElementById("status");

const resultContent =
    document.getElementById("resultContent");

const arrivedElement =
    document.getElementById("arrived");


// =====================================================
// DISTANCE CALCULATION
// =====================================================

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371000;

    const p1 =
        lat1 * Math.PI / 180;

    const p2 =
        lat2 * Math.PI / 180;

    const dp =
        (lat2 - lat1) *
        Math.PI / 180;

    const dl =
        (lon2 - lon1) *
        Math.PI / 180;

    const a =
        Math.sin(dp / 2) *
        Math.sin(dp / 2) +

        Math.cos(p1) *
        Math.cos(p2) *
        Math.sin(dl / 2) *
        Math.sin(dl / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}


// =====================================================
// UPDATE INFORMATION
// =====================================================

function updateInformation(
    lat,
    lng
) {

    const distance =
        calculateDistance(
            lat,
            lng,
            currentDestination[0],
            currentDestination[1]
        );


    if (distance < 1000) {

        distanceElement.textContent =
            Math.round(distance) + " m";

    } else {

        distanceElement.textContent =
            (distance / 1000).toFixed(2) +
            " km";
    }


    const minutes =
        Math.max(
            1,
            Math.ceil(
                (distance / 5000) * 60
            )
        );


    timeElement.textContent =
        minutes + " min";


    if (distance <= 20) {

        statusElement.textContent =
            "Arrived";

        arrivedElement.style.display =
            "block";

    } else {

        statusElement.textContent =
            "Navigating";

        arrivedElement.style.display =
            "none";
    }
}


// =====================================================
// DRAW OUTDOOR ROUTE
// =====================================================

function drawRoute(
    lat,
    lng
) {

    if (routingControl) {

        map.removeControl(
            routingControl
        );
    }


    routingControl =
        L.Routing.control({

            waypoints: [

                L.latLng(
                    lat,
                    lng
                ),

                L.latLng(
                    currentDestination[0],
                    currentDestination[1]
                )

            ],

            routeWhileDragging: false,

            showAlternatives: false,

            addWaypoints: false,

            fitSelectedRoutes: true,

            createMarker: function () {
                return null;
            }

        })

        .on(
            "routesfound",
            function (event) {

                const route =
                    event.routes[0];


                let routeDistance = 0;

                let routeTime = 0;


                if (
                    route.summary &&
                    typeof route.summary.totalDistance === "number"
                ) {

                    routeDistance =
                        route.summary.totalDistance;

                    routeTime =
                        route.summary.totalTime;
                }


                if (
                    routeDistance <= 0
                ) {

                    routeDistance =
                        calculateDistance(
                            lat,
                            lng,
                            currentDestination[0],
                            currentDestination[1]
                        );

                    routeTime =
                        (routeDistance / 5000) *
                        3600;
                }


                if (
                    routeDistance < 1000
                ) {

                    distanceElement.textContent =
                        Math.round(routeDistance) +
                        " m";

                } else {

                    distanceElement.textContent =
                        (
                            routeDistance / 1000
                        ).toFixed(2) +
                        " km";
                }


                const minutes =
                    Math.max(
                        1,
                        Math.ceil(
                            routeTime / 60
                        )
                    );


                timeElement.textContent =
                    minutes + " min";


                // =====================================
                // TURN BY TURN
                // =====================================

                const instructions =
                    route.instructions || [];


                const panel =
                    document.getElementById(
                        "directionsPanel"
                    );


                let html = `
                    <h2>🧭 Navigation Steps</h2>
                `;


                if (
                    instructions.length === 0
                ) {

                    html += `

                        <div class="directionStep">

                            <span>✓</span>

                            <div>

                                <b>
                                    Route found
                                </b>

                                <p>
                                    Follow the highlighted route on the map.
                                </p>

                            </div>

                        </div>

                    `;

                } else {

                    instructions.forEach(
                        function (
                            instruction,
                            index
                        ) {

                            let icon = "➡️";


                            const text =
                                (
                                    instruction.text ||
                                    ""
                                ).toLowerCase();


                            if (
                                text.includes("left")
                            ) {

                                icon = "⬅️";

                            } else if (
                                text.includes("right")
                            ) {

                                icon = "➡️";

                            } else if (
                                text.includes("straight") ||
                                text.includes("continue") ||
                                text.includes("head")
                            ) {

                                icon = "⬆️";

                            } else if (
                                text.includes("arrive") ||
                                text.includes("destination")
                            ) {

                                icon = "🟢";
                            }


                            const distance =
                                Math.round(
                                    instruction.distance || 0
                                );


                            html += `

                                <div class="directionStep">

                                    <span>
                                        ${index + 1}
                                    </span>

                                    <div>

                                        <b>
                                            ${icon}
                                            ${instruction.text}
                                        </b>

                                        <p>
                                            ${distance} m
                                        </p>

                                    </div>

                                </div>

                            `;
                        }
                    );
                }


                panel.innerHTML =
                    html;

            }
        )

        .addTo(map);
}


// =====================================================
// START OUTDOOR NAVIGATION
// =====================================================

document
    .getElementById("routeBtn")
    .addEventListener(
        "click",
        function () {

            if (!navigator.geolocation) {

                alert(
                    "Location is not supported by this browser."
                );

                return;
            }


            statusElement.textContent =
                "Finding location...";


            navigator.geolocation.getCurrentPosition(

                function (position) {

                    const lat =
                        position.coords.latitude;

                    const lng =
                        position.coords.longitude;


                    if (userMarker) {

                        map.removeLayer(
                            userMarker
                        );
                    }


                    userMarker =
                        L.marker([
                            lat,
                            lng
                        ])
                        .addTo(map)
                        .bindPopup(
                            "<b>📍 You are here</b>"
                        )
                        .openPopup();


                    updateInformation(
                        lat,
                        lng
                    );


                    drawRoute(
                        lat,
                        lng
                    );


                    if (
                        watchId === null
                    ) {

                        watchId =
                            navigator.geolocation
                                .watchPosition(

                                    function (
                                        position
                                    ) {

                                        const newLat =
                                            position.coords.latitude;

                                        const newLng =
                                            position.coords.longitude;


                                        if (
                                            userMarker
                                        ) {

                                            userMarker.setLatLng([
                                                newLat,
                                                newLng
                                            ]);
                                        }


                                        updateInformation(
                                            newLat,
                                            newLng
                                        );

                                    },

                                    function () {

                                        console.log(
                                            "Live location unavailable"
                                        );

                                    },

                                    {
                                        enableHighAccuracy: true,
                                        maximumAge: 5000,
                                        timeout: 10000
                                    }
                                );
                    }

                },

                function () {

                    alert(
                        "Location permission nahi mili."
                    );


                    statusElement.textContent =
                        "Location unavailable";

                },

                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        }
    );


// =====================================================
// SR UNIVERSITY BUTTON
// =====================================================

document
    .getElementById("collegeBtn")
    .addEventListener(
        "click",
        function () {

            currentDestination =
                collegeLocation;


            map.setView(
                collegeLocation,
                17
            );


            collegeMarker.openPopup();


            statusElement.textContent =
                "SR University selected";
        }
    );


// =====================================================
// HOSPITAL BUTTON
// =====================================================

document
    .getElementById("hospitalBtn")
    .addEventListener(
        "click",
        function () {

            currentDestination =
                hospitalLocation;


            map.setView(
                hospitalLocation,
                17
            );


            hospitalMarker.openPopup();


            statusElement.textContent =
                "Hospital selected";
        }
    );


// =====================================================
// CAMPUS SEARCH
// =====================================================

function searchCampus(
    query
) {

    query =
        query
            .toLowerCase()
            .trim();


    if (!query) {

        resultContent.innerHTML =
            "Please enter a location.";

        return;
    }


    const results =
        campusData.filter(
            function (location) {

                const searchable =
                    [
                        location.name,
                        location.block,
                        ...location.keywords,
                        ...location.details
                    ]
                    .join(" ")
                    .toLowerCase();


                return searchable.includes(
                    query
                );
            }
        );


    if (
        results.length === 0
    ) {

        resultContent.innerHTML = `

            <div class="destinationTitle">
                ❌ Location not found
            </div>

            <div class="destinationItem">

                Try:
                Block 1, Block 2,
                Block 3, Block 7,
                Block 8, Block 10,
                Block 11, CSE,
                Python Lab, Physics Lab,
                Canteen, Admission or HOD.

            </div>

        `;


        statusElement.textContent =
            "Not found";

        return;
    }


    resultContent.innerHTML =
        "";


    results.forEach(
        function (location) {

            let html = `

                <div class="destinationTitle">
                    🏢 ${location.name}
                </div>

                <div class="indoorBadge">
                    📍 ${location.block}
                </div>

            `;


            location.details.forEach(
                function (detail) {

                    let icon = "📍";


                    const lower =
                        detail.toLowerCase();


                    if (
                        lower.includes(
                            "ground floor"
                        )
                    ) {

                        icon = "🟢";

                    } else if (
                        lower.includes(
                            "1st floor"
                        )
                    ) {

                        icon = "🔵";

                    } else if (
                        lower.includes(
                            "2nd floor"
                        )
                    ) {

                        icon = "🟣";
                    }


                    html += `

                        <div class="floorCard">

                            <div class="floorTitle">
                                ${icon} ${detail}
                            </div>

                            <div class="floorLocation">
                                📍 Indoor Location
                            </div>

                        </div>

                    `;
                }
            );


            html += `

                <div class="destinationItem">

                    ⚠️ Prototype campus information

                </div>

                <br>

            `;


            resultContent.innerHTML +=
                html;

        }
    );


    statusElement.textContent =
        results.length +
        " result(s) found";


    document
        .getElementById("resultPanel")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// =====================================================
// SEARCH BUTTON
// =====================================================

document
    .getElementById("searchBtn")
    .addEventListener(
        "click",
        function () {

            const query =
                document
                    .getElementById(
                        "searchInput"
                    )
                    .value;


            searchCampus(
                query
            );
        }
    );


// =====================================================
// ENTER KEY SEARCH
// =====================================================

document
    .getElementById("searchInput")
    .addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                searchCampus(
                    event.target.value
                );
            }
        }
    );


// =====================================================
// QUICK SEARCH
// =====================================================

function quickSearch(
    query
) {

    document
        .getElementById(
            "searchInput"
        )
        .value = query;


    searchCampus(
        query
    );
}


// =====================================================
// INDOOR ROUTES
// =====================================================

const indoorRoutes = {

    "block8-ground_python-second": [

        {
            title: "Start",
            text: "You are at Block 8 Ground Floor.",
            floor: "Ground Floor"
        },

        {
            title: "Walk Straight",
            text: "Walk straight through the ground-floor corridor.",
            floor: "Ground Floor"
        },

        {
            title: "Turn Right",
            text: "Turn right toward the staircase.",
            floor: "Ground Floor"
        },

        {
            title: "Take the Stairs",
            text: "Go up one floor.",
            floor: "1st Floor"
        },

        {
            title: "Continue Upstairs",
            text: "Continue to the next staircase and go up one more floor.",
            floor: "2nd Floor"
        },

        {
            title: "Turn Left",
            text: "Turn left toward the Python Lab area.",
            floor: "2nd Floor"
        },

        {
            title: "Arrived",
            text: "Python Lab is ahead.",
            floor: "2nd Floor"
        }

    ],


    "block8-first_python-second": [

        {
            title: "Start",
            text: "You are at Block 8 First Floor.",
            floor: "1st Floor"
        },

        {
            title: "Walk Straight",
            text: "Follow the first-floor corridor.",
            floor: "1st Floor"
        },

        {
            title: "Take the Stairs",
            text: "Go up one floor.",
            floor: "2nd Floor"
        },

        {
            title: "Turn Left",
            text: "Turn left toward the Python Lab.",
            floor: "2nd Floor"
        },

        {
            title: "Arrived",
            text: "Python Lab is ahead.",
            floor: "2nd Floor"
        }

    ],


    "block8-second_python-second": [

        {
            title: "Start",
            text: "You are already on the destination floor.",
            floor: "2nd Floor"
        },

        {
            title: "Walk Straight",
            text: "Follow the second-floor corridor.",
            floor: "2nd Floor"
        },

        {
            title: "Turn Left",
            text: "Turn left toward the Python Lab.",
            floor: "2nd Floor"
        },

        {
            title: "Arrived",
            text: "Python Lab is ahead.",
            floor: "2nd Floor"
        }

    ],


    "block8-ground_lecture-first": [

        {
            title: "Start",
            text: "You are at Block 8 Ground Floor.",
            floor: "Ground Floor"
        },

        {
            title: "Walk Straight",
            text: "Follow the ground-floor corridor.",
            floor: "Ground Floor"
        },

        {
            title: "Turn Right",
            text: "Turn right toward the staircase.",
            floor: "Ground Floor"
        },

        {
            title: "Take the Stairs",
            text: "Go up one floor.",
            floor: "1st Floor"
        },

        {
            title: "Turn Left",
            text: "Turn left toward the Lecture Hall.",
            floor: "1st Floor"
        },

        {
            title: "Arrived",
            text: "Lecture Hall is ahead.",
            floor: "1st Floor"
        }

    ],


    "block8-ground_python-ground": [

        {
            title: "Start",
            text: "You are at Block 8 Ground Floor.",
            floor: "Ground Floor"
        },

        {
            title: "Walk Straight",
            text: "Follow the ground-floor corridor.",
            floor: "Ground Floor"
        },

        {
            title: "Turn Left",
            text: "Turn left toward the Python Lab.",
            floor: "Ground Floor"
        },

        {
            title: "Arrived",
            text: "Python Lab is ahead.",
            floor: "Ground Floor"
        }

    ],


    "block8-first_lecture-first": [

        {
            title: "Start",
            text: "You are at Block 8 First Floor.",
            floor: "1st Floor"
        },

        {
            title: "Walk Straight",
            text: "Follow the first-floor corridor.",
            floor: "1st Floor"
        },

        {
            title: "Turn Right",
            text: "Turn right toward the Lecture Hall.",
            floor: "1st Floor"
        },

        {
            title: "Arrived",
            text: "Lecture Hall is ahead.",
            floor: "1st Floor"
        }

    ],


    "block8-second_lecture-first": [

        {
            title: "Start",
            text: "You are at Block 8 Second Floor.",
            floor: "2nd Floor"
        },

        {
            title: "Walk to Staircase",
            text: "Walk toward the staircase.",
            floor: "2nd Floor"
        },

        {
            title: "Go Down",
            text: "Go down one floor.",
            floor: "1st Floor"
        },

        {
            title: "Turn Left",
            text: "Turn left toward the Lecture Hall.",
            floor: "1st Floor"
        },

        {
            title: "Arrived",
            text: "Lecture Hall is ahead.",
            floor: "1st Floor"
        }

    ]

};


// =====================================================
// GET INDOOR ROUTE
// =====================================================

function getIndoorRoute(
    start,
    destination
) {

    const key =
        start + "_" + destination;


    if (
        indoorRoutes[key]
    ) {

        return indoorRoutes[key];
    }


    return [

        {
            title: "Start",
            text: "Start from your selected location.",
            floor: "Selected Floor"
        },

        {
            title: "Follow Corridor",
            text: "Follow the main campus corridor.",
            floor: "Indoor"
        },

        {
            title: "Use Staircase",
            text: "Use the nearest staircase to reach the destination floor.",
            floor: "Indoor"
        },

        {
            title: "Follow Signs",
            text: "Follow the signs toward your selected destination.",
            floor: "Destination Floor"
        },

        {
            title: "Arrived",
            text: "You have reached the selected destination.",
            floor: "Destination"
        }

    ];
}


// =====================================================
// RENDER INDOOR ROUTE
// =====================================================

function renderIndoorRoute(
    route
) {

    const routeContainer =
        document.getElementById(
            "indoorRoute"
        );


    routeContainer.innerHTML =
        "";


    route.forEach(
        function (
            step,
            index
        ) {

            const stepElement =
                document.createElement(
                    "div"
                );


            stepElement.className =
                "indoorStep";


            stepElement.innerHTML = `

                <div class="indoorStepNumber">
                    ${index + 1}
                </div>

                <div class="indoorStepContent">

                    <div class="indoorStepTitle">
                        ${step.title}
                    </div>

                    <div class="indoorStepText">
                        ${step.text}
                    </div>

                    <span class="indoorFloor">
                        📍 ${step.floor}
                    </span>

                </div>

            `;


            routeContainer.appendChild(
                stepElement
            );
        }
    );
}


// =====================================================
// UPDATE INDOOR PROGRESS
// =====================================================

function updateIndoorProgress(
    currentStep,
    totalSteps
) {

    const progress =
        Math.round(
            (
                currentStep /
                totalSteps
            ) * 100
        );


    const fill =
        document.getElementById(
            "indoorProgressFill"
        );


    const text =
        document.getElementById(
            "indoorProgressText"
        );


    fill.style.width =
        progress + "%";


    if (
        currentStep >= totalSteps
    ) {

        text.textContent =
            "Arrived ✓";

    } else {

        text.textContent =
            progress + "%";
    }
}


// =====================================================
// START INDOOR NAVIGATION
// =====================================================

let indoorTimer = null;


function startIndoorNavigation() {

    const start =
        document.getElementById(
            "indoorStart"
        ).value;


    const destination =
        document.getElementById(
            "indoorDestination"
        ).value;


    const route =
        getIndoorRoute(
            start,
            destination
        );


    const progressPanel =
        document.getElementById(
            "indoorProgress"
        );


    const routeContainer =
        document.getElementById(
            "indoorRoute"
        );


    progressPanel.style.display =
        "block";


    renderIndoorRoute(
        route
    );


    updateIndoorProgress(
        0,
        route.length
    );


    statusElement.textContent =
        "Indoor navigation started";


    if (
        indoorTimer
    ) {

        clearInterval(
            indoorTimer
        );
    }


    let currentStep = 0;


    const steps =
        routeContainer.querySelectorAll(
            ".indoorStep"
        );


    function highlightStep() {

        steps.forEach(
            function (step) {

                step.style.opacity =
                    "0.45";

            }
        );


        if (
            steps[currentStep]
        ) {

            steps[currentStep].style.opacity =
                "1";

            steps[currentStep].scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    }


    highlightStep();


    indoorTimer =
        setInterval(
            function () {

                currentStep++;


                updateIndoorProgress(
                    currentStep,
                    route.length
                );


                if (
                    currentStep >=
                    route.length
                ) {

                    clearInterval(
                        indoorTimer
                    );


                    statusElement.textContent =
                        "Indoor destination reached";


                    routeContainer.innerHTML += `

                        <div class="indoorArrived">

                            🟢 You have arrived at your destination!

                        </div>

                    `;


                    return;
                }


                highlightStep();

            },
            1400
        );
}


// =====================================================
// INDOOR BUTTON
// =====================================================

document
    .getElementById(
        "indoorStartBtn"
    )
    .addEventListener(
        "click",
        startIndoorNavigation
    );


// =====================================================
// INITIAL SCREEN
// =====================================================

resultContent.innerHTML = `

    <div class="destinationTitle">
        👋 Welcome to Universal Navigation
    </div>

    <div class="destinationItem">
        Search for a campus facility,
        department, block or lab.
    </div>

    <div class="destinationItem">

        Try:
        <b>CSE</b>,
        <b>Python Lab</b>,
        <b>Canteen</b>,
        <b>Physics Lab</b>

    </div>

    <div class="destinationItem">

        🏢 For indoor navigation,
        select a starting floor and destination above.

    </div>

`;


// =====================================================
// CONSOLE MESSAGE
// =====================================================

console.log(
    "Universal Navigation loaded successfully."
);

console.log(
    "Outdoor + Indoor Navigation enabled."
);