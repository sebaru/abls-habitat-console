<div class="container-fluid">

 <div class="row m-2">
   <h3><i class="fas fa-code text-primary"></i> Edition D.L.S <strong id="idSourceTitle"></strong></h3>

   <div class ="col-auto ms-auto btn-group align-items-center">
        <button type="button" onclick="Dls_Compiler()" class="btn btn-outline-success"><i class="fas fa-coffee"></i> Compil&Start</button>
        <button type="button" onclick="Go_to_dls_run()"class="btn btn-info"><i class="fas fa-eye"></i> RUN</button>
        <button type="button" onclick="Go_to_messages()" class="btn btn-primary"><i class="fas fa-book"></i> Messages</button>
        <button type="button" onclick=Redirect("/dls") class="btn btn-secondary"><i class="fas fa-list"></i> Liste DLS</button>
         <!-- <button type="button" class="btn btn-sm btn-primary rounded-circle"><i class="fas fa-plus"></i></button>-->
   </div>
 </div>

 <div class="row m-2">
   <h5>Du synoptique <strong id="idSourceSynoptique"></strong></h5>
 </div>

<hr>

     <div class="row m-1">
       <div id="idErrorLog" class="col-12 alert alert-info" role="alert">
         <!--<h6 class="text-center">Résultat de compilation</h6>-->
       </div>
     </div>

     <div class="row m-1">
       <div class="col-12 border border-info">
         <textarea id="idSourceCode" rows="10"></textarea>
       </div>
     </div>

<!-- Container -->
</div>

<script src="/js/dls_source.js" type="text/javascript"></script>
