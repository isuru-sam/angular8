import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  serverElements = [{type:"server",name:"Test server",content:"COntent"}];
  
onServerAdded(serverData:{serverName:string,serverContent:string}) {
this.serverElements.push({
  type:'server',
  name: serverData.serverName,
  content: serverData.serverContent
});
}

onBluePrintAdded(bpData:{serverName:string,serverContent:string}) {
  this.serverElements.push({
    type:'blueprint',
    name:bpData.serverName,
    content:bpData.serverContent
  });
}
  
}
