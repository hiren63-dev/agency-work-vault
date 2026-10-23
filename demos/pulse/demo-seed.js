(() => {
  const originals = Object.fromEntries(['MEMBERS','PAYMENTS','ATTENDANCE','ENQUIRIES','EXPENSES','TRAINERS','PT_SESSIONS'].map(key => [key, window[key]]));
  const date = offset => new Date(Date.now() + offset * 86400000).toISOString().slice(0,10);
  const first = ['Aarav','Diya','Kabir','Ananya','Vivaan','Ishita','Arjun','Meera','Dev','Riya','Neel','Kavya'];
  const last = ['Shah','Mehta','Patel','Rao','Desai','Nair','Joshi','Kapoor'];
  const plans = ['monthly','quarterly','annual','halfyearly'];
  window.MEMBERS = Array.from({length:96}, (_,i) => {
    const name = first[i%12] + ' ' + last[Math.floor(i/12)%8];
    return {id:'DEMO-'+(1001+i),name,initials:name.split(' ').map(s=>s[0]).join(''),color:['#2563eb','#059669','#7c3aed','#d97706'][i%4],phone:'0000000000',email:'member'+(i+1)+'@example.com',area:['Bopal','Satellite','Thaltej','Paldi'][i%4],dob:'1995-05-14',gender:i%2?'Female':'Male',bloodGroup:'',weight:'',height:'',emergencyContact:'',joinDate:date(-120-i),plan:plans[i%4],status:i<7?'expired':i<16?'expiring':i===95?'frozen':'active',startDate:date(-24-i%10),endDate:date(i<7?-i-1:i<16?i-6:45+i),goals:['Strength','Fitness','Endurance'][i%3]};
  });
  window.PAYMENTS = Array.from({length:84},(_,i)=>{
    const m=window.MEMBERS[(i+7)%96];
    return {id:'DEMO-RCP-'+(i+1),memberId:m.id,memberName:m.name,category:'Membership',amount:[1770,4800,16520,9200][i%4],discount:0,mode:['UPI','Card','Cash'][i%3],txnId:'DEMO-'+(2000+i),date:date(-i%35),collectedBy:'Aarav Shah'};
  });
  window.ATTENDANCE = Array.from({length:240},(_,i)=>{
    const m=window.MEMBERS[(i*7)%96];
    return {id:i+1,memberId:m.id,memberName:m.name,date:date(-Math.floor(i/24)),checkIn:(6+i%12).toString().padStart(2,'0')+':15',checkOut:i<12?null:(7+i%12).toString().padStart(2,'0')+':30'};
  });
  window.ENQUIRIES = Array.from({length:18},(_,i)=>({id:'DEMO-ENQ-'+i,name:first[(i+3)%12]+' '+last[(i+2)%8],phone:'0000000000',source:['Instagram','Walk-in','Referral'][i%3],interest:['Annual Plan','PT Sessions','Monthly Plan'][i%3],status:['new','followup','demo','converted'][i%4],date:date(-i),notes:['Interested in evening strength sessions','Follow up after the trial session','Asked about personal training'][i%3]}));
  window.EXPENSES = window.EXPENSES.map((x,i)=>({...x,date:date(-i*3),desc:x.desc.replace(/June|May|April/g,'Monthly')}));
  window.TRAINERS = window.TRAINERS.map(x=>({...x,email:'trainer@example.com',phone:'0000000000'}));
  window.PT_SESSIONS = window.PT_SESSIONS.map((x,i)=>({...x,memberId:window.MEMBERS[i+20].id,memberName:window.MEMBERS[i+20].name,date:date(i-1),status:i?'scheduled':'completed'}));
  for (const [key, original] of Object.entries(originals)) { original.splice(0, original.length, ...window[key]); window[key] = original; }
})();
