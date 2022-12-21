    <div class="container">

 <div class="row m-2">
   <h3><i class="fas fa-fort-awesome text-primary"></i> Maintenance du domaine <strong>'<span id="idDomainLabel"></span>'</strong></h3>
 </div>

<hr>

<!-- Encadré Maintenance ------------------------------------------------------------------------------------------------------>

       <div class="card m-1 shadow">
         <div class="card-header"> <i class="fas fa-wrench text-warning"></i> <label>Maintenance</label> </div>
         <div class="card-body">

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Compilation complète D.L.S</label>
               <button id="idDomainCompilAllButton" type="button" class="btn btn-warning"><i class="fas fa-coffee"></i> Compil All D.L.S</button>
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Rechargement des Mappings I/O</label>
               <button id="idDomainRemap" type="button" class="btn btn-secondary"><i class="fas fa-directions"></i> Remap I/O</button>
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Rechargement des ticks Horloges</label>
               <button id="idDomainHorlogeReload" type="button" class="btn btn-secondary"><i class="fas fa-clock"></i> Recharger les Horloges</button>
             </div>
           </div>

         </div>
<!--
         <div class="card-footer d-flex">
              <button id="idDomainMaintenanceSaveButton" type="button" class="btn btn-success ml-auto">
                <i class="fas fa-save"></i> Save
              </button>
         </div>
-->
       </div>


<script src="/js/domain_maintenance.js" type="text/javascript"></script>
<!-- Container -->
</div>
