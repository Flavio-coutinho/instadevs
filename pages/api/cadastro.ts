import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import type { CadastroRequisicao } from "../../types/CadastroRequisicao";
import { UsuarioModel } from "../../models/UsuarioModel";
import md5 from 'md5';
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";

const endpointCadastro = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
) => {
  if (req.method == "POST") {
    const usuario = req.body as CadastroRequisicao;

    if (!usuario.nome || usuario.nome.length < 2) {
      return res.status(400).json({ error : "Nome inválido" });
    }

    if (
      !usuario.email ||
      usuario.email.length < 5 ||
      !usuario.email.includes("@") ||
      !usuario.email.includes(".")
    ) {
      return res.status(400).json({ error : "Email inválido" });
    }

    if (!usuario.senha || usuario.senha.length < 4) {
      return res.status(400).json({ error : "Senha inválida" });
    }

    // Validação se ja existe usuario com o mesmo email
    const usuarioComMesmoEmail = await UsuarioModel.find({email : usuario.email});
    if(usuarioComMesmoEmail && usuarioComMesmoEmail.length > 0) {
      return res.status(400).json({ error : "Ja existe uma conta com o email informado" });
    }


    // Salvar no banco de dados
    const usuarioASerSalvo = {
      nome: usuario.nome,
      email: usuario.email,
      senha: md5(usuario.senha),
    };
    await UsuarioModel.create(usuarioASerSalvo);
    return res.status(200).json({ msg: "Usuario criado com sucesso" });
  }
  return res.status(404).json({ error : "Método informado não é válido" });
};

export default conectarMongoDB(endpointCadastro);
