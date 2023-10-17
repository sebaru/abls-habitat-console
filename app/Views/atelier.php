<div class="container-fluid">

 <div class="row m-2">
   <h3><i class="fas fa-image text-primary"></i> Edition graphique du synoptique <strong id="idAtelierTitle"></strong></h3>

   <div class ="col-auto ms-auto btn-group align-items-center">
        <button type="button" onclick="Atelier_Sauvegarder_synoptique()" class="btn btn-success"><i class="fas fa-save"></i> Sauvegarder</button>
         <!-- <button type="button" class="btn btn-sm btn-primary rounded-circle"><i class="fas fa-plus"></i></button>-->
   </div>
 </div>


 <div class="row mx-1">
			<section id="idSectionHeavySyn" class="col justify-content-center">	</section>
   <div class="col-2 shadow">
     <label>DLS</label>      <input id="idSelectionDLS" type="text" class="form-control mb-1" disabled>
     <label>TechID</label>   <input id="idSelectionTechID"   type="text" class="form-control mb-1" disabled>
     <label>Acronyme</label> <input id="idSelectionAcronyme" type="text" class="form-control mb-1" disabled>
     <label>Posx</label>     <input id="idPosx"   type="number" class="form-control mb-1" step=1 min=0 max=1920>
     <label>Posy</label>     <input id="idPosy"   type="number" class="form-control mb-1" step=1 min=0 max=1080>
     <label>Scale</label>    <input id="idScale"  type="number" class="form-control mb-1" step=0.1 min=0.1 max=10>
     <label>Angle</label>    <input id="idAngle"  type="number" class="form-control mb-1" step=1 min=0 max=359>
     <label>Valeur</label>   <input id="idValeur" type="number" class="form-control mb-1" step=0.1>
     <hr>
     <label>Layer</label>    <input id="idLayer"  type="number" class="form-control mb-1" disabled>
     <div class="btn-block btn-group">
       <button id="idButtonMoveDown" class="form-control btn btn-info"><i class="fas fa-download"></i> Down</button>
       <button id="idButtonMoveUp"   class="form-control btn btn-info"><i class="fas fa-upload"></i> Up</button>
     </div>
     <div class="btn-block btn-group">
       <button id="idButtonMoveFullDown" class="form-control btn btn-info"><i class="fas fa-download"></i> Full Down</button>
       <button id="idButtonMoveFullUp"   class="form-control btn btn-info"><i class="fas fa-upload"></i> Full Up</button>
     </div>
   </div>
 </div>


<!-- Container -->
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.min.js" type="text/javascript"></script>
<script src="/js/trame.js" type="text/javascript"></script>
<script src="/js/atelier.js" type="text/javascript"></script>

