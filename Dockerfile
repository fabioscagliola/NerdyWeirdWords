FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["NerdyWeirdWordsBackend/NerdyWeirdWordsBackend.csproj", "NerdyWeirdWordsBackend/"]
RUN dotnet restore "NerdyWeirdWordsBackend/NerdyWeirdWordsBackend.csproj"
COPY . .
WORKDIR "/src/NerdyWeirdWordsBackend"
RUN dotnet build "NerdyWeirdWordsBackend.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "NerdyWeirdWordsBackend.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NerdyWeirdWordsBackend.dll"]
