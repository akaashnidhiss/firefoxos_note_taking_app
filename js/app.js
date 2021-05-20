var notesObject = {
    classname: null,
    note: null,
    db: ''
};

(function() {

    $('.mainApp').hide();
    $('.viewAll').hide();
    $('.prevMap').hide();

    initDB();
    attachEventsToElements();

    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };


    function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    }

}());

function attachEventsToElements() {

    $('#checkIn-btn').on('click', function() {

        $('.checkIn').hide(function() {

            $('.mainApp').fadeIn('fast');
            $('#notes').val('');

        });
    });

    $('#saveNotes').on('click', function(ev) {

        ev.preventDefault();

        notesObject.note = $('#notes').val();
        notesObject.classname = $('#classname').val();
        console.log('Notes object is initialised');

        saveNote();
    });

    $('.goBack').on('click', function() {

        $('.viewAll, .mainApp').hide(function() {

            $('.checkIn').fadeIn();
        });
    });

    $('.goBackList').on('click', function() {

        $('.prevMap').hide(function() {

            $('.viewAll').fadeIn();
        });
    });

    $('#viewAll-btn').on('click', function() {

        $('.checkIn').hide(function() {

            $('.viewAll').fadeIn();

            $('#prevList ul').html('');
            console.log('view previous function called');
            viewPrevious();
        });
    });

    $(document).on('click', '.list', function() {

        var classname = $(this).find('.list_classname').text();
        var note = $(this).find('.list_note').text();

        $("#prevMapHolder").html("<h4>You were in </h4>" + classname);

        $('.viewAll').hide(function() {

            $('.prevMap').fadeIn();
        })

        $('#showComment').html('<em>' + note + '</em>');
    });
    return true;
}

function initDB() {

    var request = indexedDB.open('notes_classdb_new', 1);
    console.log('initdb made');
    request.onsuccess = function(e) {
        // e.target.result has the connection to the database
        notesObject.db = request.result;
        console.log('initdb succeeded');
    };

    request.onerror = function(e) {

        console.log("Creation error:" + e);
    };

    request.onupgradeneeded = function(e) {

        // e.target.result holds the connection to database
        notesObject.db = e.target.result;
        console.log('onupgradeneeded function executed');
        if (notesObject.db.objectStoreNames.contains("notes")) {
            notesObject.db.deleteObjectStore("notes");
        }

        var objectStore = notesObject.db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
    };
    return true;
}

function saveNote() {
    console.log('save function running');
    var note = notesObject.note;
    var classname = notesObject.classname;

    // Handling addition of notes to db
    // the note
    var note = { 'note': note, 'classname': classname };

    var transaction = notesObject.db.transaction(['notes'], 'readwrite');

    // add the note to the store
    var store = transaction.objectStore('notes');

    var request = store.add(note);

    request.onsuccess = function(e) {
        console.log('note is saved');
        alert("Your note has been saved");
    };

    request.onerror = function(e) {

        alert("Error in saving the note. Reason : " + e.value);
    };
}

function viewPrevious() {

    var objectStore = notesObject.db.transaction("notes").objectStore("notes");
    console.log('viewPrevious function called');
    objectStore.openCursor().onsuccess = function(event) {
        console.log('opencursor function called');
        var cursor = event.target.result;

        if (cursor) {
            console.log('if cursor executed');
            // if (cursor.value.classname === null && typeof variable === "object") {
            //     $('#prevList ul').append('<li class="list"><i class="fa fa-caret-square-o-right fa-3x pull-left"></i> <small>Class: <span class="list_class"><em>' + cursor.value.classname + '</em></span></small><br><strong>Note: </strong><span class="list_note">' + cursor.value.note + '</span></li>');

            // } else {
            $('#prevList ul').append('<li class="list"><i class="fa fa-caret-square-o-right fa-3x pull-left"></i> <small>Class: <span class="list_classname"><em>' + cursor.value.classname + '</em></span></small><br><strong>Note: </strong><span class="list_note">' + cursor.value.note + '</span></li>');

        }
        cursor.continue();
    };
}