 var Synoptique;
 var Trame;
 var Selection_drag;
 var Selection_data;
/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Load_page ()
  { console.log ("in load archive !");
    vars = window.location.pathname.split('/');
    console.debug(vars);
    Charger_syn ( vars[2] );
  }
/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Charger_syn ( syn_page )
  {
    console.log("------------------------------ Chargement synoptique "+syn_page);

    Trame = Trame_new ("idSectionHeavySyn");
    Trame.set_grille( 20 );
    Trame.on ( "mousemove",  function ( event ) { Move_sur_trame ( event ); }, false );
    Trame.on ( "mouseup",    function ( event ) { Deselectionner( event ) }, false);
    Trame.on ( "mouseleave", function ( event ) { Deselectionner( event ) }, false);
    $("#idButtonMoveDown").on("click", function () { if (Selection_data) Selection_data.svggroupe.backward(); } );
    $("#idButtonMoveUp")  .on("click", function () { if (Selection_data) Selection_data.svggroupe.forward();  } );
    $("#idButtonMoveFullDown").on("click", function () { if (Selection_data) Selection_data.svggroupe.back(); } );
    $("#idButtonMoveFullUp")  .on("click", function () { if (Selection_data) Selection_data.svggroupe.front();  } );
    $("#idScale").on ("change", function (event) { if (Selection_data) Changer_scale (); } );
    $("#idAngle").on ("change", function (event) { if (Selection_data) Changer_angle (); } );
    $("#idPosx").on  ("change", function (event) { if (Selection_data) Changer_posx (); } );
    $("#idPosy").on  ("change", function (event) { if (Selection_data) Changer_posy (); } );

    Send_to_API ( "GET", "/syn/show", (syn_page ? "syn_page=" + syn_page : null), function(Response)
     { $("#idAtelierTitle").text( Response.page + " #" + Response.syn_id );
       console.log(Response);
       Synoptique = Response;                                                                       /* sauvegarde du pointeur */
       $.each ( Response.visuels, function (i, visuel)
                 { if (visuel.forme == null)
                    { console.log ( "new null at " + visuel.posx + " " + visuel.posy );
                      Trame.new_from_image ( visuel, visuel.icone+".gif" );
                    }
                   else if (visuel.ihm_affichage=="complexe" && visuel.forme=="bouton")  { Trame.new_button  ( visuel ); }
                   else if (visuel.ihm_affichage=="complexe" && visuel.forme=="encadre") { Trame.new_encadre ( visuel ); }
                   else if (visuel.ihm_affichage=="complexe" && visuel.forme=="comment") { Trame.new_comment ( visuel ); }
                   else if (visuel.ihm_affichage=="by_mode")       { Trame.new_by_mode ( visuel );       }
                   else if (visuel.ihm_affichage=="by_color")      { Trame.new_by_color( visuel );       }
                   else if (visuel.ihm_affichage=="by_mode_color") { Trame.new_by_mode_color ( visuel ); }
                   else if (visuel.ihm_affichage=="static")
                    { Trame.new_static( visuel, visuel.forme+"."+visuel.extension ); }

                   if (visuel.svggroupe !== undefined)
                    { visuel.svggroupe.on ( "mousedown", function (event) { Down_sur_visuel ( visuel, event ) }, false);
                      visuel.svggroupe.css( "cursor", "move" );
                    }
                 }
              );
       $.each ( Response.cadrans, function (i, cadran)
                 { Trame.new_cadran ( cadran );
                   if (cadran.svggroupe !== undefined)
                    { cadran.svggroupe.on ( "mousedown", function (event) { Down_sur_visuel ( cadran, event ); } );
                      cadran.svggroupe.css( "cursor", "move" );
                    }
                 }
              );
     } );
  }
/********************************************* Appeler quand l'utilisateur selectionne un motif *******************************/
 function Atelier_Sauvegarder_synoptique ()
  { var Motifs=[], Liens=[], Rectangles=[], Comments=[];
    var request = { syn_id: Synoptique.syn_id,
                    visuels: Synoptique.visuels.map( function ( visuel )
                                                      { return ( { syn_motif_id: visuel.syn_motif_id,
                                                                   tech_id: visuel.tech_id, acronyme: visuel.acronyme,
                                                                   posx: visuel.posx, posy: visuel.posy, scale: visuel.scale,
                                                                   angle: visuel.angle,
                                                                   layer: Trame.index(visuel.svggroupe)
                                                                 } );
                                                      }
                                                   ),
                    cadrans: Synoptique.cadrans.map( function ( cadran )
                                                      { return ( { syn_cadran_id: cadran.syn_cadran_id,
                                                                   tech_id: cadran.tech_id, acronyme: cadran.acronyme,
                                                                   posx: cadran.posx, posy: cadran.posy, scale: cadran.scale,
                                                                   angle: cadran.angle } );
                                                      }
                                                   ),
                  };
console.debug(request);
    Send_to_API ( "POST", "/syn/save", request, function(Response)
     { Show_toast_ok ( "Synoptique "+Synoptique.page+" enregistré"); }, null );
  }
/********************************************* Appeler quand l'utilisateur selectionne un motif *******************************/
 function Deselectionner ( event )
  { Selection_drag = null; }
/********************************************* Appeler quand l'utilisateur selectionne un motif *******************************/
 function Down_sur_visuel ( visuel, event )
  { event.preventDefault();
    console.log(" Clic sur motif " + visuel.libelle + " offsetx = " + event.offsetX + " offsetY="+event.offsetY + " selected=" + visuel.selected );
    console.log(" Clic sur motif " + visuel.libelle + " clientX = " + event.clientX + " clientY="+event.clientY + " selected=" + visuel.selected );
    Selection_drag = Selection_data = visuel;
    Update_selection_data();

    const domPoint = new DOMPointReadOnly ( event.clientX, event.clientY );
    const pt = domPoint.matrixTransform ( document.getElementById("idTrame").getScreenCTM().inverse() )

    console.log("add poignee " + pt.x + " " + pt.y );
    visuel.clic_x = pt.x;
    visuel.clic_y = pt.y;
    /*isuel.svgpoignee = Trame.circle( 40, 40 ).attr("cx", pt.x - visuel.posx ).attr("cy", pt.y-visuel.posy )
                             .attr("fill", "blue" ).attr("fill-opacity", "0.6" )
                             .attr("stroke-dasharray", "5 5").attr("stroke-width", 2 ).attr("stroke-linecap", "round")
                             .attr("stroke", "yellow" ).attr("stroke-opacity", "1" )
                             .css("cursor", "move");*/
    /*visuel.svgpoignee.on ( "mousemove",  function (event) { Move_sur_poignee( visuel, event ) }, false);
    visuel.svgpoignee.on ( "mouseup",    function (event) { Deselectionner( event ) }, false);
    visuel.svgpoignee.on ( "mouseleave", function (event) { Deselectionner( event ) }, false);
    visuel.svggroupe.add ( visuel.svgpoignee );*/
  }
/********************************************* Appeler quand l'utilisateur selectionne un motif *******************************/
 function Move_sur_trame ( event )
  { event.preventDefault();
    if (!Selection_drag) return;
    console.log(" Move sur poigne " + Selection.libelle + " clientX = " + event.clientX + " clientY="+event.clientY + " selected=" + Selection.selected );
    const domPoint = new DOMPointReadOnly(event.clientX, event.clientY)
    const pt = domPoint.matrixTransform(document.getElementById("idTrame").getScreenCTM().inverse())

    if (event.shiftKey) maille = 1; else maille = Trame.maille;

    var old_x    = parseInt(Selection_drag.posx / maille);
    var clic_x   = parseInt(Selection_drag.clic_x / maille);
    var pt_x     = parseInt(pt.x / maille);
    var delta_x  = pt_x - clic_x;
    var new_posx = (old_x + delta_x) * maille;
    if (new_posx<0)    new_posx = 0;
    if (new_posx>1920) new_posx = 1920;
    Selection_drag.posx   = new_posx;
    Selection_drag.clic_x = pt_x * maille;

    var old_y    = parseInt(Selection_drag.posy / maille);
    var clic_y   = parseInt(Selection_drag.clic_y / maille);
    var pt_y     = parseInt(pt.y / maille);
    var delta_y  = pt_y - clic_y;
    var new_posy = (old_y + delta_y) * maille;
    if (new_posy<0)    new_posy = 0;
    if (new_posy>1080) new_posy = 1080;
    if (new_posy != Selection_drag.posy)
     { Selection_drag.posy   = new_posy;
       Selection_drag.clic_y = pt_y * maille;
     }

    Trame.update_matrice ( Selection_drag );
    Update_selection_data ();
  }
/********************************************* Appeler quand on change le scale ***********************************************/
 function Changer_posx ( )
  { Selection_data.posx = parseInt($("#idPosx").val());
    console.log(" Change Posx sur motif " + Selection_data.libelle + " posx = " + Selection_data.posx );
    Trame.update_matrice ( Selection_data );
  }
/********************************************* Appeler quand on change le scale ***********************************************/
 function Changer_posy ( )
  { Selection_data.posy = parseInt($("#idPosy").val());
    console.log(" Change Posy sur motif " + Selection_data.libelle + " posy = " + Selection_data.posy );
    Trame.update_matrice ( Selection_data );
  }
/********************************************* Appeler quand on change le scale ***********************************************/
 function Changer_scale ( )
  { Selection_data.scale = parseFloat($("#idScale").val());
    console.log(" Change Scale sur motif " + Selection_data.libelle + " scale = " + Selection_data.scale );
    Trame.update_matrice ( Selection_data );
  }
/********************************************* Appeler quand on change l'angle ************************************************/
 function Changer_angle ( )
  { Selection_data.angle = parseInt($("#idAngle").val());
    console.log(" Change Angle sur motif " + Selection_data.libelle + " angle = " + Selection_data.angle );
    Trame.update_matrice ( Selection_data );
  }
/********************************************* Appeler quand l'utilisateur selectionne un motif *******************************/
 function Update_selection_data ( )
  { $("#idSelectionTechID").val(Selection_data.tech_id);
    $("#idSelectionAcronyme").val(Selection_data.acronyme);
    $("#idPosition").val("x:" + Selection_data.posx+", y:"+Selection_data.posy);
    $("#idPosx").val(Selection_data.posx);
    $("#idPosy").val(Selection_data.posy);
    $("#idScale").val(Selection_data.scale);
    $("#idAngle").val(Selection_data.angle);
  }
/********************************************* Appeler quand l'utilisateur selectionne un motif *******************************/
 function Change_lien_properties ()
  { svg_selected.lien.src_posx = document.getElementById("WTD-ctrl-panel-lien-x1").value;
    svg_selected.setAttribute("x1", svg_selected.lien.src_posx);
    svg_selected.lien.src_posy = document.getElementById("WTD-ctrl-panel-lien-y1").value;
    svg_selected.setAttribute("y1", svg_selected.lien.src_posy);
    svg_selected.lien.dst_posx = document.getElementById("WTD-ctrl-panel-lien-x2").value;
    svg_selected.setAttribute("x2", svg_selected.lien.dst_posx);
    svg_selected.lien.dst_posy = document.getElementById("WTD-ctrl-panel-lien-y2").value;
    svg_selected.setAttribute("y2", svg_selected.lien.dst_posy);
    svg_selected.lien.stroke = document.getElementById("WTD-ctrl-panel-lien-stroke").value;
    svg_selected.setAttribute("stroke", svg_selected.lien.stroke);
    svg_selected.lien.stroke_width = document.getElementById("WTD-ctrl-panel-lien-stroke-width").value;
    svg_selected.setAttribute("stroke-width", svg_selected.lien.stroke_width);
    svg_selected.lien.stroke_dasharray = document.getElementById("WTD-ctrl-panel-lien-stroke-dasharray").value;
    svg_selected.setAttribute("stroke-dasharray", svg_selected.lien.stroke_dasharray);
    svg_selected.lien.stroke_linecap = document.getElementById("WTD-ctrl-panel-lien-stroke-linecap").value;
    svg_selected.setAttribute("stroke-linecap", svg_selected.lien.stroke_linecap);
    svg_selected.lien.tech_id  = document.getElementById("WTD-ctrl-panel-lien-tech-id").value;
    svg_selected.lien.acronyme = document.getElementById("WTD-ctrl-panel-lien-acronyme").value;
  }
/********************************************* Appeler quand l'utilisateur selectionne un motif *******************************/
 function Ajouter_lien ()
  { var topsvg = document.getElementById("TopSVG");
    var object =
     { syn_id: syn_id,
       src_posx: 100,
       src_posy: 100,
       dst_posx: 200,
       dst_posy: 200,
       stroke: "#c8c8c8",
       stroke_dasharray: "",
       stroke_linecap: "butt",
       stroke_width: 5,
       tech_id: "",
       acronyme: ""
     };
    var json_request = JSON.stringify(object);
    var xhr = new XMLHttpRequest;
    xhr.open('post',base_url + "admin/syn/add_lien", true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = function()
     { if ( ! (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) ) return;
       var Response = JSON.parse(xhr.responseText);                                         /* Pointe sur <synoptique a=1 ..> */
       Load_Lien_to_canvas ( Response[0] );
     };
    xhr.send(json_request);
  }
/********************************************* Appeler quand l'utilisateur selectionne un motif *******************************/
 function Clic_sur_lien ( event )
  { Deselectionner();
    svg=event.target;
    console.debug(svg);
    console.log(" Clic sur lien " + svg.lien.id );
    document.getElementById("WTD-ctrl-panel").innerHTML= Div_Ctrl_panel_Lien;
    document.getElementById("WTD-ctrl-panel-lien-x1").value = svg.lien.src_posx;
    document.getElementById("WTD-ctrl-panel-lien-y1").value = svg.lien.src_posy;
    document.getElementById("WTD-ctrl-panel-lien-x2").value = svg.lien.dst_posx;
    document.getElementById("WTD-ctrl-panel-lien-y2").value = svg.lien.dst_posy;
    document.getElementById("WTD-ctrl-panel-lien-stroke").value = svg.lien.stroke;
    document.getElementById("WTD-ctrl-panel-lien-stroke-width").value = svg.lien.stroke_width;
    document.getElementById("WTD-ctrl-panel-lien-stroke-dasharray").value = svg.lien.stroke_dasharray;
    document.getElementById("WTD-ctrl-panel-lien-stroke-linecap").value = svg.lien.stroke_linecap;
    document.getElementById("WTD-ctrl-panel-lien-tech-id").value = svg.lien.tech_id;
    document.getElementById("WTD-ctrl-panel-lien-acronyme").value = svg.lien.acronyme;
    svg_selected = svg;
    svg_selected.ChangeState ( 0, "#0000dd", 0 );
  }
/********************************************* Prepare un objet SVG et l'affiche sur la page **********************************/
 function Load_Lien_to_canvas ( Lien )
  { var svg=document.createElementNS("http://www.w3.org/2000/svg", 'line');
    svg.lien = Lien;                                                                   /* Sauvegarde du pointeur Motif source */
    svg.setAttribute("id", "WTD-lien-"+svg.lien.id);
    svg.setAttribute("x1", svg.lien.src_posx);
    svg.setAttribute("y1", svg.lien.src_posy);
    svg.setAttribute("x2", svg.lien.dst_posx);
    svg.setAttribute("y2", svg.lien.dst_posy);
    svg.setAttribute("stroke", svg.lien.stroke);
    svg.setAttribute("stroke-width", svg.lien.stroke_width);
    svg.setAttribute("stroke-linecap", svg.lien.stroke_linecap);
    if(svg.lien.stroke_dasharray!=undefined) svg.setAttribute("stroke-dasharray",svg.lien.stroke_dasharray);

    svg.ChangeState = function ( state, color, cligno )                                      /* Fonction de changement d'etat */
     { if (color==undefined) color=this.lien.stroke;
       this.setAttribute("stroke", color );                                                                   /* Go Animate ! */
       this.currentColor = color;
       this.ChangeCligno ( cligno );
     }
                                                                                       /* ajout des objects de clignottements */
    var myanim=document.createElementNS("http://www.w3.org/2000/svg", 'animate');
    myanim.setAttribute("id","fadeout");
    myanim.setAttribute("class","WTD-animate");
    myanim.setAttribute("attributeName","opacity");
    myanim.setAttribute("from","1");
    myanim.setAttribute("to","0.5");
    myanim.setAttribute("dur","0.7s");
    myanim.setAttribute("fill","freeze");
    myanim.setAttribute("begin","indefinite");
    myanim.addEventListener ( "end", function (event)
                                     { svg.getElementById("fadein").beginElement(); }, false );
    svg.appendChild(myanim);

    var myanim=document.createElementNS("http://www.w3.org/2000/svg", 'animate');
    myanim.setAttribute("id","fadein");
    myanim.setAttribute("class","WTD-animate");
    myanim.setAttribute("attributeName","opacity");
    myanim.setAttribute("from","0.5");
    myanim.setAttribute("to","1");
    myanim.setAttribute("dur","0.3s");
    myanim.setAttribute("fill","freeze");
    myanim.addEventListener ( "end", function (event)
                               { if (svg.currentCligno==1) svg.getElementById("fadeout").beginElement(); }, false );
    svg.appendChild(myanim);

    svg.ChangeCligno = function ( cligno )
     { if (cligno==this.currentCligno) return;
       if (cligno==1)
        { svg.currentCligno=1;
          svg.getElementById("fadeout").beginElement();
        }
       else
        { svg.currentCligno=0;
        }
     }

    console.debug(svg);
    svg.addEventListener ( "click", function (event) { Clic_sur_lien( event ) }, false);
    $("#TopSVG").append(svg);                                                        /* ajout du SVG dans le Top SVG */
    console.log("Fin Traite Lien id: "+svg.lien.id);
  }
/********************************************* Appeler quand l'utilisateur selectionne un motif *******************************/
 function Ajouter_rectangle ()
  { var topsvg = document.getElementById("TopSVG");
    var object =
     { syn_id: syn_id,
       posx: 100,
       posy: 100,
       width: 10,
       height: 10,
       rx: 3,
       ry: 3,
       stroke: "#00ff00",
       stroke_width: 1,
       def_color: "#c8c8c8",
       tech_id : "",
       acronyme:""
     };
    var json_request = JSON.stringify(object);
    var xhr = new XMLHttpRequest;
    xhr.open('post',base_url + "admin/syn/add_rectangle", true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = function()
     { if ( ! (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) ) return;
       var Response = JSON.parse(xhr.responseText);                                         /* Pointe sur <synoptique a=1 ..> */
       Load_Rectangle_to_canvas ( Response[0] );
     };
    xhr.send(json_request);
  }
/********************************************* Appeler quand l'utilisateur selectionne un motif *******************************/
 function Change_rectangle_properties ()
  { svg_selected.rectangle.posx = document.getElementById("WTD-ctrl-panel-rectangle-posx").value;
    svg_selected.setAttribute("x", svg_selected.rectangle.posx);
    svg_selected.rectangle.posy = document.getElementById("WTD-ctrl-panel-rectangle-posy").value;
    svg_selected.setAttribute("y", svg_selected.rectangle.posy);
    svg_selected.rectangle.width = document.getElementById("WTD-ctrl-panel-rectangle-width").value;
    svg_selected.setAttribute("width", svg_selected.rectangle.width);
    svg_selected.rectangle.height = document.getElementById("WTD-ctrl-panel-rectangle-height").value;
    svg_selected.setAttribute("height", svg_selected.rectangle.height);
    svg_selected.rectangle.rx = document.getElementById("WTD-ctrl-panel-rectangle-rx").value;
    svg_selected.setAttribute("rx", svg_selected.rectangle.rx);
    svg_selected.rectangle.ry = document.getElementById("WTD-ctrl-panel-rectangle-ry").value;
    svg_selected.setAttribute("ry", svg_selected.rectangle.ry);
    svg_selected.rectangle.stroke = document.getElementById("WTD-ctrl-panel-rectangle-stroke").value;
    svg_selected.setAttribute("stroke", svg_selected.rectangle.stroke);
    svg_selected.rectangle.stroke_width = document.getElementById("WTD-ctrl-panel-rectangle-stroke-width").value;
    svg_selected.setAttribute("stroke-width", svg_selected.rectangle.stroke_width);
    svg_selected.rectangle.stroke_dasharray = document.getElementById("WTD-ctrl-panel-rectangle-stroke-dasharray").value;
    svg_selected.setAttribute("stroke-dasharray", svg_selected.rectangle.stroke_dasharray);
    svg_selected.rectangle.def_color = document.getElementById("WTD-ctrl-panel-rectangle-def-color").value;
    svg_selected.setAttribute("fill", svg_selected.rectangle.color);
    svg_selected.rectangle.tech_id  = document.getElementById("WTD-ctrl-panel-rectangle-tech-id").value;
    svg_selected.rectangle.acronyme = document.getElementById("WTD-ctrl-panel-rectangle-acronyme").value;
  }
/********************************************* Appeler quand l'utilisateur selectionne un motif *******************************/
 function Clic_sur_rectangle ( event )
  { Deselectionner();
    svg=event.target;
    console.debug(svg);
    console.log(" Clic sur rectangle " + svg.rectangle.id );
    document.getElementById("WTD-ctrl-panel").innerHTML= Div_Ctrl_panel_Rectangle;
    document.getElementById("WTD-ctrl-panel-rectangle-posx").value = svg.rectangle.posx;
    document.getElementById("WTD-ctrl-panel-rectangle-posy").value = svg.rectangle.posy;
    document.getElementById("WTD-ctrl-panel-rectangle-width").value = svg.rectangle.width;
    document.getElementById("WTD-ctrl-panel-rectangle-height").value = svg.rectangle.height;
    document.getElementById("WTD-ctrl-panel-rectangle-rx").value = svg.rectangle.rx;
    document.getElementById("WTD-ctrl-panel-rectangle-ry").value = svg.rectangle.ry;
    document.getElementById("WTD-ctrl-panel-rectangle-stroke").value = svg.rectangle.stroke;
    document.getElementById("WTD-ctrl-panel-rectangle-stroke-width").value = svg.rectangle.stroke_width;
    document.getElementById("WTD-ctrl-panel-rectangle-stroke-dasharray").value = svg.rectangle.stroke_dasharray;
    document.getElementById("WTD-ctrl-panel-rectangle-def-color").value = svg.rectangle.def_color;
    document.getElementById("WTD-ctrl-panel-rectangle-tech-id").value = svg.rectangle.tech_id;
    document.getElementById("WTD-ctrl-panel-rectangle-acronyme").value = svg.rectangle.acronyme;
    svg_selected = svg;
    svg_selected.ChangeState ( 0, "#0000dd", 0 );
  }
/********************************************* Prepare un objet SVG et l'affiche sur la page **********************************/
 function Load_Rectangle_to_canvas ( Rectangle )
  { var svg=document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    svg.rectangle = Rectangle;                                                                   /* Sauvegarde du pointeur Motif source */
    svg.setAttribute("id", "WTD-rectangle-"+svg.rectangle.id);
    svg.setAttribute("x", svg.rectangle.posx);
    svg.setAttribute("y", svg.rectangle.posy);
    svg.setAttribute("rx", svg.rectangle.rx);
    svg.setAttribute("ry", svg.rectangle.ry);
    svg.setAttribute("width", svg.rectangle.width);
    svg.setAttribute("height", svg.rectangle.height);
    svg.setAttribute("fill", svg.rectangle.def_color);
    svg.setAttribute("stroke", svg.rectangle.stroke);
    svg.setAttribute("stroke-width", svg.rectangle.stroke_width);
    if(svg.rectangle.stroke_dasharray!=undefined) svg.setAttribute("stroke-dasharray",svg.rectangle.stroke_dasharray);

    svg.ChangeState = function ( state, color, cligno )                                      /* Fonction de changement d'etat */
     { if (color==undefined) color=this.rectangle.def_color;
       this.setAttribute("fill", color );                                                                     /* Go Animate ! */
       this.currentColor = color;
       this.ChangeCligno ( cligno );
     }
                                                                                       /* ajout des objects de clignottements */
    var myanim=document.createElementNS("http://www.w3.org/2000/svg", 'animate');
    myanim.setAttribute("id","fadeout");
    myanim.setAttribute("class","WTD-animate");
    myanim.setAttribute("attributeName","opacity");
    myanim.setAttribute("from","1");
    myanim.setAttribute("to","0.5");
    myanim.setAttribute("dur","0.7s");
    myanim.setAttribute("fill","freeze");
    myanim.setAttribute("begin","indefinite");
    myanim.addEventListener ( "end", function (event)
                                     { svg.getElementById("fadein").beginElement(); }, false );
    svg.appendChild(myanim);

    var myanim=document.createElementNS("http://www.w3.org/2000/svg", 'animate');
    myanim.setAttribute("id","fadein");
    myanim.setAttribute("class","WTD-animate");
    myanim.setAttribute("attributeName","opacity");
    myanim.setAttribute("from","0.5");
    myanim.setAttribute("to","1");
    myanim.setAttribute("dur","0.3s");
    myanim.setAttribute("fill","freeze");
    myanim.addEventListener ( "end", function (event)
                               { if (svg.currentCligno==1) svg.getElementById("fadeout").beginElement(); }, false );
    svg.appendChild(myanim);

    svg.ChangeCligno = function ( cligno )
     { if (cligno==this.currentCligno) return;
       if (cligno==1)
        { svg.currentCligno=1;
          svg.getElementById("fadeout").beginElement();
        }
       else
        { svg.currentCligno=0;
        }
     }
    console.debug(svg);
    svg.addEventListener ( "click", function (event) { Clic_sur_rectangle( event ) }, false);
    $("#TopSVG").append(svg);                                                        /* ajout du SVG dans le Top SVG */
    console.log("Fin Traite Rectangle id: "+svg.rectangle.id);
  }
/********************************************* Appeler quand l'utilisateur selectionne un motif *******************************/
 function Change_comment_properties ()
  { svg_selected.comment.libelle = document.getElementById("WTD-ctrl-panel-comment-libelle").value;
    svg_selected.textContent = svg_selected.comment.libelle;
    svg_selected.comment.posx = document.getElementById("WTD-ctrl-panel-comment-posx").value;
    svg_selected.setAttribute("x", svg_selected.comment.posx);
    svg_selected.comment.posy = document.getElementById("WTD-ctrl-panel-comment-posy").value;
    svg_selected.setAttribute("y", svg_selected.comment.posy);
    svg_selected.comment.angle = document.getElementById("WTD-ctrl-panel-comment-angle").value;
    svg_selected.setAttribute("transform","rotate("+svg.comment.angle+" "+svg.comment.posx+" "+svg.comment.posy+")");
    svg_selected.comment.def_color = document.getElementById("WTD-ctrl-panel-comment-def-color").value;
    svg_selected.setAttribute("fill", svg_selected.comment.def_color);
    svg_selected.comment.font = document.getElementById("WTD-ctrl-panel-comment-font-family").value;
    svg_selected.setAttribute("font-family", svg_selected.comment.font);
    svg_selected.comment.font_size = document.getElementById("WTD-ctrl-panel-comment-font-size").value;
    svg_selected.setAttribute("font-size", svg_selected.comment.font_size);
  }
/********************************************* Appeler quand l'utilisateur selectionne un motif *******************************/
 function Ajouter_comment ()
  { var topsvg = document.getElementById("TopSVG");
    var object =
     { syn_id: syn_id,
       libelle: "New Comment !",
       posx: 100,
       posy: 100,
       def_color: "#c8c8c8",
       font: "Verdana",
       font_size: 20
     };
    var json_request = JSON.stringify(object);
    var xhr = new XMLHttpRequest;
    xhr.open('post',base_url + "admin/syn/add_comment", true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = function()
     { if ( ! (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) ) return;
       var Response = JSON.parse(xhr.responseText);                                         /* Pointe sur <synoptique a=1 ..> */
       Load_Comment_to_canvas ( Response[0] );
     };
    xhr.send(json_request);
  }
/********************************************* Appeler quand l'utilisateur selectionne un motif *******************************/
 function Clic_sur_comment ( event )
  { Deselectionner();
    svg=event.target;
    console.debug(svg);
    console.log(" Clic sur Comment " + svg.comment.id );
    document.getElementById("WTD-ctrl-panel").innerHTML= Div_Ctrl_panel_Comment;
    document.getElementById("WTD-ctrl-panel-comment-libelle").value = svg.comment.libelle;
    document.getElementById("WTD-ctrl-panel-comment-posx").value = svg.comment.posx;
    document.getElementById("WTD-ctrl-panel-comment-posy").value = svg.comment.posy;
    document.getElementById("WTD-ctrl-panel-comment-angle").value = svg.comment.angle;
    document.getElementById("WTD-ctrl-panel-comment-def-color").value = svg.comment.def_color;
    document.getElementById("WTD-ctrl-panel-comment-font-family").value = svg.comment.font;
    document.getElementById("WTD-ctrl-panel-comment-font-size").value = svg.comment.font_size;
    svg_selected = svg;
    /*svg_selected.ChangeState ( 0, "#0000dd", 0 );*/
  }
/********************************************* Prepare un objet SVG et l'affiche sur la page **********************************/
 function Load_Comment_to_canvas ( Comment )
  { var svg=document.createElementNS("http://www.w3.org/2000/svg", 'text');
    svg.comment = Comment;                                                             /* Sauvegarde du pointeur Motif source */
    svg.setAttribute( "id", "WTD-comment-"+svg.comment.id );
    svg.setAttribute("x",svg.comment.posx);
    svg.setAttribute("y",svg.comment.posy);
    svg.setAttribute("fill",svg.comment.def_color);
    svg.setAttribute("text-anchor","middle");
    if(svg.comment.font       !=undefined) svg.setAttribute("font-family",svg.comment.font);
    if(svg.comment.font_size  !=undefined) svg.setAttribute("font-size",svg.comment.font_size);
    if(svg.comment.angle      ==undefined) svg.comment.angle=0;
    svg.setAttribute("transform","rotate("+svg.comment.angle+" "+svg.comment.posx+" "+svg.comment.posy+")");
    svg.textContent = svg.comment.libelle;

    svg.ChangeState = function ( state, color, cligno )                                      /* Fonction de changement d'etat */
     { if (color==undefined) color=this.comment.def_color;
       this.setAttribute("fill", color );                                                                     /* Go Animate ! */
       /*this.currentColor = color;
       this.ChangeCligno ( cligno );*/
     }
    svg.addEventListener ( "click", function (event) { Clic_sur_comment( event ) }, false);
    console.debug(svg);
    $("#TopSVG").append(svg);                                                                 /* ajout du SVG dans le Top SVG */
    console.log("Fin Traite Comment id: "+svg.comment.id);
  }
/*----------------------------------------------------------------------------------------------------------------------------*/
