 var Synoptique;
 var Trame;
/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Load_page ()
  { console.log ("in load archive !");
    vars = window.location.pathname.split('/');
    console.debug(vars);
    Charger_syn ( vars[2] );
	 }

 var svg_selected;

 var Div_Ctrl_panel_Motif=
       '<div class="row">'+
       '  <label class="col-4 col-form-label-sm">Posx</label>'+
       '  <input id="WTD-ctrl-panel-motif-posx" class="form-control-sm col-8" type="number" min="0" step="10" onchange="Change_motif_properties()"/>'+
       '</div>'+

       '<div class="row">'+
       '  <label class="col-4 col-form-label-sm">Posy</label>'+
       '  <input id="WTD-ctrl-panel-motif-posy" class="form-control-sm col-8" type="number" min="0" step="10" onchange="Change_motif_properties()"/>'+
       '</div>'+

       '<div class="row">'+
       '  <label class="col-4 col-form-label-sm">Scale</label>'+
       '  <input id="WTD-ctrl-panel-motif-scale" class="form-control-sm col-8" type="number" min="0.2" max="5" step="0.1" onchange="Change_motif_properties()"/> </div>'+
       '</div>'+

       '<div class="row">'+
       '  <label class="col-4 col-form-label-sm">Angle</label>'+
       '  <input id="WTD-ctrl-panel-motif-angle" class="form-control-sm col-8" type="number" min="0" max="360" step="5" onchange="Change_motif_properties()"/> </div>'+
       '</div>'+

       '<div class="row">'+
       '  <label class="col-6 col-form-label-sm">Default Color</label>'+
       '  <input id="WTD-ctrl-panel-motif-color" class="form-control-sm col-6" type="color" onchange="Change_motif_properties()"/> </div>'+
       '</div>'+

       '<div class="row">'+
       '  <label class="col-6 col-form-label-sm">Ctrl Tech_id</label>'+
       '  <input id="WTD-ctrl-panel-motif-tech-id" class="form-control-sm col-6" onchange="Change_motif_properties()"/> </div>'+
       '</div>'+

       '<div class="row">'+
       '  <label class="col-6 col-form-label-sm">Ctrl Acronyme</label>'+
       '  <input id="WTD-ctrl-panel-motif-acronyme" class="form-control-sm col-6" onchange="Change_motif_properties()"/> </div>'+
       '</div>'+

       '<div class="row">'+
       '  <label class="col-6 col-form-label-sm">Clic Tech_id</label>'+
       '  <input id="WTD-ctrl-panel-motif-clic-tech-id" class="form-control-sm col-6" onchange="Change_motif_properties()"/> </div>'+
       '</div>'+

       '<div class="row">'+
       '  <label class="col-6 col-form-label-sm">Clic Acronyme</label>'+
       '  <input id="WTD-ctrl-panel-motif-clic-acronyme" class="form-control-sm col-6" onchange="Change_motif_properties()"/> </div>'+
       '</div>'+

       '<div class="row">'+
       '  <label class="col-6 col-form-label-sm">Access Level</label>'+
       '  <input id="WTD-ctrl-panel-motif-access-level" class="form-control-sm col-6" type="number" min="0" max="9" step="1" onchange="Change_motif_properties()"/> </div>'+
       '</div>'+

       '<div class="row">'+
       '  <label class="col-4 col-form-label-sm">Libellé</label>'+
       '  <input id="WTD-ctrl-panel-motif-libelle" class="form-control-sm col-8" onchange="Change_motif_properties()"/> </div>'+
       '</div>';
 var Div_Ctrl_panel_Lien=
       '<div class="col-sd-1"><label>Src_Posx</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-lien-x1" type="number" min="0" step="10" onchange="Change_lien_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Src_Posy</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-lien-y1" type="number" min="0" step="10" onchange="Change_lien_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Dst_Posx</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-lien-x2" type="number" min="0" step="10" onchange="Change_lien_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Dst_Posy</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-lien-y2" type="number" min="0" step="10" onchange="Change_lien_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Stroke</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-lien-stroke" type="color" onchange="Change_lien_properties()"/> </div>'+
       '<div class="col-sd-1"><label>StrokeWidth</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-lien-stroke-width" type="number" min="1" max="15" step="1" onchange="Change_lien_properties()"/> </div>'+
       '<div class="col-sd-1"><label>DashArray</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-lien-stroke-dasharray" onchange="Change_lien_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Linecap</label></div>'+
       '<div class="col-sd-1"><select id="WTD-ctrl-panel-lien-stroke-linecap" onchange="Change_lien_properties()"/>'+
                              '<option value="butt">Normal</option>'+
                              '<option value="round">Arrondi</option>'+
                              '<option value="square">Carré</option>'+
                              '</select></div>'+
       '<div class="col-sd-1"><label>Control Tech_id</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-lien-tech-id" onchange="Change_lien_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Control Acronyme</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-lien-acronyme" onchange="Change_lien_properties()"/> </div>';
 var Div_Ctrl_panel_Rectangle=
       '<div class="col-sd-1"><label>Posx</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-rectangle-posx" type="number" min="0" step="10" onchange="Change_rectangle_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Posy</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-rectangle-posy" type="number" min="0" step="10" onchange="Change_rectangle_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Width</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-rectangle-width" type="number" min="5" step="5" onchange="Change_rectangle_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Height</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-rectangle-height" type="number" min="5" step="5" onchange="Change_rectangle_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Rx</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-rectangle-rx" type="number" min="0" onchange="Change_rectangle_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Ry</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-rectangle-ry" type="number" min="0" onchange="Change_rectangle_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Default color</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-rectangle-def-color" type="color" onchange="Change_rectangle_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Stroke</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-rectangle-stroke" type="color" onchange="Change_rectangle_properties()"/> </div>'+
       '<div class="col-sd-1"><label>StrokeWidth</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-rectangle-stroke-width" type="number" min="1" max="15" step="1" onchange="Change_rectangle_properties()"/> </div>'+
       '<div class="col-sd-1"><label>DashArray</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-rectangle-stroke-dasharray" onchange="Change_rectangle_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Control Tech_id</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-rectangle-tech-id" onchange="Change_rectangle_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Control Acronyme</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-rectangle-acronyme" onchange="Change_rectangle_properties()"/> </div>';
 var Div_Ctrl_panel_Comment=
       '<div class="col-sd-1"><label>Libellé</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-comment-libelle" type="text" onchange="Change_comment_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Posx</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-comment-posx" type="number" min="0" step="10" onchange="Change_comment_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Posy</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-comment-posy" type="number" min="0" step="10" onchange="Change_comment_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Couleur</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-comment-def-color" type="color" onchange="Change_comment_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Angle</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-comment-angle" type="number" min="0" max="360" step="5" onchange="Change_comment_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Font Family</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-comment-font-family" onchange="Change_comment_properties()"/> </div>'+
       '<div class="col-sd-1"><label>Font size</label></div>'+
       '<div class="col-sd-1"><input id="WTD-ctrl-panel-comment-font-size" type="number" min="10" max="100" step="5" onchange="Change_comment_properties()"/> </div>';

/*************************************** Met à jour la matrice de transformation **********************************************/
 function SVG_New_from_image ( image_filename )
  { var svgimage = Trame.image( "https://static.abls-habitat.fr/img/"+image_filename, function(event)
                                 { this.dx ( -this.width()/2 );
                                   this.dy ( -this.height()/2 );
                                 } );
    return( svgimage );
  }
/*************************************** Met à jour la matrice de transformation **********************************************/
 function SVG_New_from_texte ( texte )
  { var svgtext = Trame.text( texte ).font( 'anchor', 'middle' );
    return( svgtext );
  }
/*************************************** Met à jour la matrice de transformation **********************************************/
 function SVG_Update_matrice ( visuel )
  { visuel.svggroupe.transform ( { scale: visuel.scale, translate: [visuel.posx, visuel.posy],
                                   rotate: visuel.angle, origin: 'center center' } );
  }
/********************************************* Chargement du synoptique 1 au démrrage *****************************************/
 function Charger_syn ( syn_page )
  {
    $("#idSectionHeavySyn").empty().css("position","relative");
    Trame = SVG().addTo("#idSectionHeavySyn").attr("id", "idTrame")
                 .attr("viewBox", "0 0 1920 1080")
                 .attr("preserveAspectRatio", "xMidYMid meet")
                 .addClass("border border-success")
                 .css("background-color", "darkgray");

    Trame.new_cadran = function ( cadran )
     { console.log ( "new cadran " + cadran.forme + " " + cadran.tech_id + ":" + cadran.acronyme + " " + cadran.posx + "x" + cadran.posy );
       cadran.svggroupe = Trame.group().attr("id", "wtd-visu-"+cadran.tech_id+"-"+cadran.acronyme);
       Trame.add(cadran.svggroupe);
       var rectangle = Trame.rect ( 110, 30 ).cx(0).cy(0).attr("rx", 10).fill("gray" ).stroke({ width:1, color:"lightgreen" });
       cadran.svggroupe.add ( rectangle );

       var texte = SVG_New_from_texte ( "- cadran -" ).cx(0).cy(0).font ( { family: "arial", size:14, anchor: "middle", variant:"italic" } );
       cadran.svggroupe.add ( texte );
       SVG_Update_matrice ( cadran );
     }

    console.log("------------------------------ Chargement synoptique "+syn_page);
    Send_to_API ( "GET", "/syn/show", (syn_page ? "syn_page=" + syn_page : null), function(Response)
     { $("#idAtelierTitle").text( Response.page );
       console.log(Response);
       Synoptique = Response;                                                                       /* sauvegarde du pointeur */
       $.each ( Response.visuels, function (i, visuel)
                 { if (visuel.forme == null)
                    { console.log ( "new null at " + visuel.posx + " " + visuel.posy );
                      visuel.svggroupe = Trame.group().attr("id", "wtd-visu-"+visuel.tech_id+"-"+visuel.acronyme);
                      Trame.add(visuel.svggroupe);
                      visuel.svggroupe.add ( SVG_New_from_image ( Trame, visuel.icone+".gif" ) );
                      SVG_Update_matrice ( visuel );
                    }
                   else if (visuel.ihm_affichage=="complexe" && visuel.forme=="bouton")
                    { var button = $("<button>").css("position", "absolute").addClass("btn btn-sm")
                                                .css("left", visuel.posx).css("top", visuel.posy)
                                                .css("translate", "-50% -50%")
                                                .append( visuel.libelle )
                           if (visuel.color=="blue")   button.addClass("btn-primary");
                      else if (visuel.color=="orange") button.addClass("btn-warning");
                      else if (visuel.color=="gray")   button.addClass("btn-secondary");
                      else if (visuel.color=="red")    button.addClass("btn-danger");
                      else if (visuel.color=="green")  button.addClass("btn-success");
                      else button.addClass("btn-outline-dark").attr("disabled", '');
                      console.debug(button);
                      $("#idSectionHeavySyn").append ( button );
                    }
                   else if (visuel.ihm_affichage=="complexe" && visuel.forme=="encadre")
                    { console.log ( "new encadre " + visuel.posx + " " + visuel.posy );
                      visuel.svggroupe = Trame.group().attr("id", "wtd-visu-"+visuel.tech_id+"-"+visuel.acronyme);
                      Trame.add(visuel.svggroupe);

                      var dimensions = visuel.mode.split('x');
                      console.log("Encadre : dimensions");
                      console.debug(dimensions);
                      if (!dimensions[0]) dimensions[0] = 1;
                      if (!dimensions[1]) dimensions[1] = 1;

                      var hauteur=64*parseInt(dimensions[0]);
                      var largeur=64*parseInt(dimensions[1]);

                      var titre = SVG_New_from_texte ( visuel.libelle );
                      titre.cx(0).cy(-hauteur/2 -20 )
                           .attr("font-size", "14" )
                           .attr("font-family", "Sans" )
                           .attr("font-style", "italic" )
                           .attr("font-weight", "normal" )
                           .attr("fill", visuel.color )
                           .attr("stroke", visuel.color );
                      visuel.svggroupe.add ( titre );

                      var rect = Trame.rect( largeur, hauteur ).x(-largeur/2).y(-hauteur/2).attr("rx", 15)
                                      .attr("fill", "none" ).attr("stroke-width", 4 ).attr("stroke", visuel.color );
                      visuel.svggroupe.add ( rect );
                      SVG_Update_matrice ( visuel );
                     }
                   else if (visuel.ihm_affichage=="complexe" && visuel.forme=="comment")
                    { console.log ( "new encadre " + visuel.posx + " " + visuel.posy );
                      visuel.svggroupe = Trame.group().attr("id", "wtd-visu-"+visuel.tech_id+"-"+visuel.acronyme);
                      Trame.add(visuel.svggroupe);
                      var size, family, style, weight;
                      if ( visuel.mode == "titre" )
                       { size = 32;
                         family = "Sans";
                         style  = "italic";
                         weight = "normal";
                       }
                      else if ( visuel.mode =="soustitre" )
                       { size = 24;
                         family = "Sans";
                         style  = "italic";
                         weight = "normal";
                       }
                      else
                       { size   = 14;
                         family = "Sans";
                         style  = "italic";
                         weight = "normal";
                       }

                      var texte = SVG_New_from_texte ( visuel.libelle );
                      texte.attr("font-size", size).attr("font-family", family + ",serif" )
                           .attr("font-style", style ).attr("font-weight", weight )
                           .attr("fill", visuel.color ).attr("stroke", visuel.color )
                           .x(0).y(0);
                      visuel.svggroupe.add ( texte );
                      SVG_Update_matrice ( visuel );
                    }
                   else if (visuel.ihm_affichage=="by_mode")
                    { console.log ( "new by_mode at " + visuel.posx + " " + visuel.posy );
                      visuel.svggroupe = Trame.group().attr("id", "wtd-visu-"+visuel.tech_id+"-"+visuel.acronyme);
                      Trame.add(visuel.svggroupe);
                      visuel.svggroupe.add ( SVG_New_from_image ( visuel.forme+"_"+visuel.mode+"."+visuel.extension ) );
                      SVG_Update_matrice ( visuel );
                    }
                   else if (visuel.ihm_affichage=="by_color")
                    { console.log ( "new by_color at " + visuel.posx + " " + visuel.posy );
                      visuel.svggroupe = Trame.group().attr("id", "wtd-visu-"+visuel.tech_id+"-"+visuel.acronyme);
                      Trame.add(visuel.svggroupe);
                      visuel.svggroupe.add ( SVG_New_from_image ( visuel.forme+"_"+visuel.color+"."+visuel.extension ) );
                      SVG_Update_matrice ( visuel );
                    }
                   else if (visuel.ihm_affichage=="by_mode_color")
                    { console.log ( "new by_mode_color at " + visuel.posx + " " + visuel.posy );
                      visuel.svggroupe = Trame.group().attr("id", "wtd-visu-"+visuel.tech_id+"-"+visuel.acronyme);
                      Trame.add(visuel.svggroupe);
                      visuel.svggroupe.add ( SVG_New_from_image ( visuel.forme+"_"+visuel.mode+"_"+visuel.color+"."+visuel.extension ) );
                      SVG_Update_matrice ( visuel );
                    }
                   else if (visuel.ihm_affichage=="static")
                    { console.log ( "new static at " + visuel.posx + " " + visuel.posy );
                      visuel.svggroupe = Trame.group().attr("id", "wtd-visu-"+visuel.tech_id+"-"+visuel.acronyme);
                      Trame.add(visuel.svggroupe);
                      visuel.svggroupe.add ( SVG_New_from_image ( visuel.forme+"."+visuel.extension ) );
                      SVG_Update_matrice ( visuel );
                    }
                   if (visuel.svggroupe !== undefined)
                   { visuel.svggroupe.on ( "click", function (event) { Clic_sur_motif ( visuel, event ) }, false);
                     /*visuel.svggroupe.on ( "mouseup", function (event) { Up_sur_motif( visuel, event ) }, false);
                     visuel.svggroupe.on ( "mouseleave", function (event) { Up_sur_motif( visuel, event ) }, false);
                     visuel.svggroupe.on ( "mousedown", function (event) { Down_sur_motif( visuel, event ) }, false);
                     visuel.svggroupe.on ( "mousemove", function (event) { Move_sur_motif( visuel, event ) }, false);*/
                   }
                 }
              );
       $.each ( Response.cadrans, function (i, cadran)
                 { Trame.new_cadran ( cadran );
                   if (cadran.svggroupe !== undefined)
                    { cadran.svggroupe.on ( "click", function (event) { Clic_sur_motif ( cadran, event ) }, false); }
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
                                                                   angle: visuel.angle } );
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
 function Deselectionner ( )
  { if (svg_selected)
     { if (svg_selected.motif)     { svg_selected.ChangeState ( 0, svg_selected.motif.def_color, false ); }
       if (svg_selected.rectangle) { svg_selected.ChangeState ( 0, svg_selected.rectangle.def_color, false ); }
       if (svg_selected.lien)      { svg_selected.ChangeState ( 0, svg_selected.lien.stroke, false ); }
       if (svg_selected.comment)   { svg_selected.ChangeState ( 0, svg_selected.comment.def_color, false ); }
     }
    document.getElementById("WTD-ctrl-panel").innerHTML="Rien n'est sélectionné";
  }

/********************************************* Appeler quand l'utilisateur selectionne un motif *******************************/
 function Change_motif_properties ()
  { svg_selected.motif.posx          = document.getElementById("WTD-ctrl-panel-motif-posx").value;
    svg_selected.motif.posy          = document.getElementById("WTD-ctrl-panel-motif-posy").value;
    svg_selected.motif.angle         = document.getElementById("WTD-ctrl-panel-motif-angle").value;
    svg_selected.motif.scale         = document.getElementById("WTD-ctrl-panel-motif-scale").value;
    svg_selected.motif.def_color     = document.getElementById("WTD-ctrl-panel-motif-color").value;
    svg_selected.motif.access_level  = document.getElementById("WTD-ctrl-panel-motif-access-level").value;
    svg_selected.motif.libelle       = document.getElementById("WTD-ctrl-panel-motif-libelle").value;
    svg_selected.motif.tech_id       = document.getElementById("WTD-ctrl-panel-motif-tech-id").value;
    svg_selected.motif.acronyme      = document.getElementById("WTD-ctrl-panel-motif-acronyme").value;
    svg_selected.motif.clic_tech_id  = document.getElementById("WTD-ctrl-panel-motif-clic-tech-id").value;
    svg_selected.motif.clic_acronyme = document.getElementById("WTD-ctrl-panel-motif-clic-acronyme").value;
    svg_selected.UpdateSVGMatrix();
  }
/********************************************* Appeler quand l'utilisateur selectionne un motif *******************************/
 function SvgScreen_to_SVGPoint(x, y)
  { var trame = document.getElementById("idTrame");
    var pt = trame.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(trame.getScreenCTM().inverse());
  }

/********************************************* Appeler quand l'utilisateur selectionne un motif *******************************/
 function Clic_sur_motif ( visuel, event )
  { console.log(" Down sur motif " + visuel.libelle + " offsetx = " + event.clientX + " offsetY="+event.clientY + " selected=" + visuel.selected );
    if (visuel.selected != true)
     { console.log("add poignee");
       visuel.selected = true;
       visuel.svgpoignee = Trame.circle( 60 ).attr("cx", 0 ).attr("cy", 0 )
                                .attr("fill", "lightblue" ).attr("fill-opacity", "0.5" )
                                .attr("stroke-dasharray", "5 5").attr("stroke-width", 2 ).attr("stroke-linecap", "round")
                                .attr("stroke", "black" ).attr("stroke-opacity", "1" )
                                .css("cursor", "pointer");
       visuel.svgpoignee.on ( "mousemove", function (event) { Move_sur_poignee( visuel, event ) }, false);
       visuel.svgpoignee.on ( "mouseleave", function (event) { Clic_sur_motif( visuel, event ) }, false);
       visuel.svggroupe.front().add ( visuel.svgpoignee );
     }
    else
     { visuel.selected = false;
       visuel.svgpoignee.remove();
     }
  }
/********************************************* Appeler quand l'utilisateur selectionne un motif *******************************/
 function Move_sur_poignee ( visuel, event )
  { console.log(" Move sur motif " + visuel.libelle + " offsetx = " + event.clientX + " offsetY="+event.clientY );
    var pos = SvgScreen_to_SVGPoint ( event.clientX, event.clientY );
    visuel.posx = Math.trunc(pos.x);
    visuel.posy = Math.trunc(pos.y);
    console.log ( "new posx " + visuel.posx + " : " + visuel.posy );
    SVG_Update_matrice ( visuel );
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
