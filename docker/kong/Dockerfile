FROM kong:3.4.2
LABEL description="Kong 3.4.2 + Kong-Oidc + Kong-Spec-Expose Plugin"

#FROM kong:latest
#LABEL description="Kong latest + Kong-Oidc + Kong-Spec-Expose Plugin"

USER root

RUN apt clean all

RUN apt install -y git unzip luarocks

RUN luarocks install --pin lua-resty-jwt 0.2.2-0
RUN luarocks install kong-oidc
RUN luarocks install kong-spec-expose

USER kong

# http://kong:8000/admin-api
# IoxasQqFvTdv6X2SFSV8a1wFWibHDHVA