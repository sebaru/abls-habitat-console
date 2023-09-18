/********************************************* Chargement d'une courbe ********************************************************/
 function Load_page ()
  { var vars = window.location.pathname.split('/');
    var period = vars[4];
    if (period!=null) $("#idCourbePeriod").val( period );
    $("#idCourbePeriod").off("change").on("change", function () { Redirect ( "/courbe/"+vars[2]+"/"+vars[3]+"/"+$("#idCourbePeriod").val() ); } );
    Charger_une_courbe ( "idChartCourbe", vars[2], vars[3], period )
  }
