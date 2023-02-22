<div class="container-fluid">

 <div class="row m-2">
   <h3><i class="fas fa-image text-primary"></i> Edition graphique du synoptique <strong id="idAtelierTitle"></strong></h3>

   <div class ="ml-auto btn-group align-items-start">
        <button type="button" onclick="Atelier_Sauvegarder_synoptique()" class="btn btn-success"><i class="fas fa-save"></i> Sauvegarder</button>
         <!-- <button type="button" class="btn btn-sm btn-primary rounded-circle"><i class="fas fa-plus"></i></button>-->
   </div>
 </div>


 <div class="row mx-1">
			<section id="idSectionHeavySyn" class="col justify-content-center">	</section>
   <div class="col-2 shadow">
     <label>TechID</label>   <input id="idSelectionTechID"   type="text" class="form-control mb-1" disabled>
     <label>Acronyme</label> <input id="idSelectionAcronyme" type="text" class="form-control mb-1" disabled>
     <label>Position</label>  <input id="idPosition"  type="text" class="form-control mb-1" disabled>
     <label>Scale</label>     <input id="idScale"     type="number" class="form-control mb-1" step=0.1 min=0.1 max=10>
     <label>Angle</label>     <input id="idAngle"     type="number" class="form-control mb-1" step=1 min=0 max=359>
     <hr>
     <div class="btn-block btn-group">
       <button id="idButtonMoveDown" class="form-control btn btn-info"><i class="fas fa-download"></i> Down</button>
       <button id="idButtonMoveUp"   class="form-control btn btn-info"><i class="fas fa-upload"></i> Up</button>
     </div>
   </div>
 </div>


<!-- Container -->
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.min.js" type="text/javascript"></script>
<script src="/js/trame.js" type="text/javascript"></script>
<script src="/js/atelier.js" type="text/javascript"></script>

