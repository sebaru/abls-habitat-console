/********************************************* Chargement d'une courbe ********************************************************/
 function Load_page ()
  { vars = window.location.pathname.split('/');
    $("#idCourbePeriod").off("change").on("change", function () { Redirect ( "/courbe/"+vars[2]+"/"+vars[3]+"/"+$("#idCourbePeriod").val() ); } );
    Charger_une_courbe ( "idChartCourbe", vars[2], vars[3], vars[4] )
  }
