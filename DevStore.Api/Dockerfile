# ── Build ──────────────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Restore (camada separada para cache)
COPY DevStore.Domain/DevStore.Domain.csproj         DevStore.Domain/
COPY DevStore.Infrastructure/DevStore.Infrastructure.csproj DevStore.Infrastructure/
COPY DevStore.Api/DevStore.Api.csproj               DevStore.Api/
RUN dotnet restore DevStore.Api/DevStore.Api.csproj

# Publish
COPY DevStore.Domain/       DevStore.Domain/
COPY DevStore.Infrastructure/ DevStore.Infrastructure/
COPY DevStore.Api/          DevStore.Api/
RUN dotnet publish DevStore.Api/DevStore.Api.csproj \
    -c Release -o /app/publish --no-restore

# ── Runtime ────────────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

# Diretório para o arquivo SQLite (montado como volume)
RUN mkdir -p /data

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "DevStore.Api.dll"]
