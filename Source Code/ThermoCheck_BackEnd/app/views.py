from .models import Temperature
from .serializers import TempSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

# Create your views here.
class History(APIView):
    def get(self, request):
        temps = Temperature.objects.all().order_by('-id')
        ser=TempSerializer(temps, many=True)
        return Response(ser.data, status=status.HTTP_200_OK)

class Home(APIView):
    def get(self,request):
        #save uniqe names
        temps=Temperature.objects.none()
        T=Temperature.objects.all().order_by('-id')
        names=[]
        for t in T:
            if t.name not in names:
                names.append(t.name)
                temps|=Temperature.objects.filter(pk=t.pk)
        

        ser=TempSerializer(temps, many=True)
        
        return Response(ser.data, status=status.HTTP_200_OK)

    def post(self,request):
        
        ser=TempSerializer(data=request.data)
        if ser.is_valid():
            ser.save()
            objs=Temperature.objects.filter(name=ser.data.get('name'))
            while objs.count() > 60:#recorded every 1 mins, in the last hour
            #delete smallest ID object when new element posted
                try:
                    record=objs.order_by("id").first()
                    record.delete()
                    print("record deleted")
                except:
                    print("record DNE")
            return Response(ser.data,status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
