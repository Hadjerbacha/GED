# workflows/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Workflow, CustomUser
from .serializers import WorkflowSerializer, UserSerializer
from django.db.models import Q

@api_view(['GET'])
def get_users(request):
    users = CustomUser.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_workflows(request):
    query = request.GET.get('query', '')
    status = request.GET.get('status', '')  

    workflows = Workflow.objects.all()

    if query:
        workflows = workflows.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(assigned_user__username__icontains=query)
        )
    
    if status:
        workflows = workflows.filter(status=status)

    serializer = WorkflowSerializer(workflows, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_workflow(request):
    name = request.data.get('name')
    description = request.data.get('description')
    user_id = request.data.get('assigned_user')
    status = request.data.get('status')

    try:
        if not name or not description:
            raise ValueError("Nom et description sont requis.")

        # Vérification de l'existence de l'utilisateur
        assigned_user = CustomUser.objects.get(id=user_id) if user_id else None

        # Création du workflow
        workflow = Workflow.objects.create(
            name=name,
            description=description,
            assigned_user=assigned_user,
            status=status
        )

        return Response({"message": "Workflow créé avec succès", "workflow_id": workflow.id}, status=status.HTTP_201_CREATED)

    except CustomUser.DoesNotExist:
        return Response({"error": "Utilisateur non trouvé"}, status=status.HTTP_400_BAD_REQUEST)

    except ValueError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": f"Une erreur inattendue est survenue : {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
