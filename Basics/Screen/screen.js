const journey = document.getElementById('myRange');
    const value = journey.value;

    //Value from the Calibration
    const calibrationValue = localStorage.getItem('calibrationValue');

    // Values from Basic
    const canvasId = localStorage.getItem('canvasId');
    const pathValue = localStorage.getItem('pathValue');
    document.getElementById('canvasId').textContent = canvasId;
    document.getElementById('pathValue').textContent = pathValue;


    function setPath(id, pathValue){
        switch (id) {
            case 'rise':
                path(150, pathValue);
                break;
            case 'fall':
                path(pathValue, 0);
                break;
            case 'olymp':
                fancyPath(150, pathValue, 150);
                break;
            case 'tartarus':
                fancyPath(50, pathValue, 50);
                break;
        }

    }
    