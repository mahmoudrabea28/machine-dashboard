import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router)
  const locladata = localStorage.getItem("authToken")

 
  if(locladata != null){
    return true;
  }else{
    router.navigateByUrl('');
    return false;
  }
};
