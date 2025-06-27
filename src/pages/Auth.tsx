import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/dashboard');
      }
    };
    checkUser();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (isLogin) {
      // Admin login shortcut
      if (email === 'harsh@admin' && password === 'harsh@admin') {
        navigate('/admin');
        return;
      }
      // Login
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else navigate("/dashboard");
    } else {
      // Signup
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username: username
          }
        }
      });
      if (error) setError(error.message);
      else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="login-box">
        <p>{isLogin ? "Sign In" : "Sign Up"}</p>
        <form onSubmit={handleAuth}>
          <div className="user-box">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ background: 'transparent', color: '#fff' }}
            />
            <label style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>Email</label>
          </div>
          
          {!isLogin && (
            <div className="user-box">
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ background: 'transparent', color: '#fff' }}
              />
              <label style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>Username</label>
            </div>
          )}
          
          <div className="user-box">
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ background: 'transparent', color: '#fff' }}
            />
            <label style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>Password</label>
          </div>
          
          {error && (
            <div style={{ color: '#ff6b6b', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
              {error}
            </div>
          )}
          
          <button type="submit" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <a>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              {isLogin ? "Sign In" : "Sign Up"}
            </a>
          </button>
        </form>
        
        <p style={{ marginTop: '30px', textAlign: 'center' }}>
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <a className="a2" onClick={() => setIsLogin(false)} style={{ cursor: 'pointer' }}>
                Sign up here
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a className="a2" onClick={() => setIsLogin(true)} style={{ cursor: 'pointer' }}>
                Sign in here
              </a>
            </>
          )}
        </p>
      </div>
      
      <style>{`
        .login-box {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 400px;
          padding: 40px;
          margin: 20px auto;
          transform: translate(-50%, -55%);
          background: rgba(0,0,0,.9);
          box-sizing: border-box;
          box-shadow: 0 15px 25px rgba(0,0,0,.6);
          border-radius: 10px;
        }

        .login-box p:first-child {
          margin: 0 0 30px;
          padding: 0;
          color: #fff;
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .login-box .user-box {
          position: relative;
          margin-bottom: 40px;
        }

        .login-box .user-box input {
          width: 100%;
          padding: 12px 0 8px 0;
          font-size: 17px;
          color: #fff;
          margin-bottom: 0;
          border: none;
          border-bottom: 1.5px solid #fff;
          outline: none;
          background: transparent;
          z-index: 1;
        }

        .login-box .user-box label {
          position: absolute;
          top: 12px;
          left: 0;
          font-size: 15px;
          color: #fff;
          font-weight: 600;
          pointer-events: none;
          transition: 0.3s cubic-bezier(.4,0,.2,1);
          z-index: 2;
        }

        .login-box .user-box input:focus ~ label,
        .login-box .user-box input:not(:placeholder-shown):not([value=""]) ~ label,
        .login-box .user-box input:valid ~ label {
          top: -18px;
          left: 0;
          color: #fff;
          font-size: 12px;
          background: transparent;
        }

        .login-box form a {
          position: relative;
          display: inline-block;
          padding: 10px 20px;
          font-weight: bold;
          color: #fff;
          font-size: 16px;
          text-decoration: none;
          text-transform: uppercase;
          overflow: hidden;
          transition: .5s;
          margin-top: 40px;
          letter-spacing: 3px
        }

        .login-box a:hover {
          background: #fff;
          color: #272727;
          border-radius: 5px;
        }

        .login-box a span {
          position: absolute;
          display: block;
        }

        .login-box a span:nth-child(1) {
          top: 0;
          left: -100%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #fff);
          animation: btn-anim1 1.5s linear infinite;
        }

        @keyframes btn-anim1 {
          0% {
            left: -100%;
          }

          50%,100% {
            left: 100%;
          }
        }

        .login-box a span:nth-child(2) {
          top: -100%;
          right: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(180deg, transparent, #fff);
          animation: btn-anim2 1.5s linear infinite;
          animation-delay: .375s
        }

        @keyframes btn-anim2 {
          0% {
            top: -100%;
          }

          50%,100% {
            top: 100%;
          }
        }

        .login-box a span:nth-child(3) {
          bottom: 0;
          right: -100%;
          width: 100%;
          height: 2px;
          background: linear-gradient(270deg, transparent, #fff);
          animation: btn-anim3 1.5s linear infinite;
          animation-delay: .75s
        }

        @keyframes btn-anim3 {
          0% {
            right: -100%;
          }

          50%,100% {
            right: 100%;
          }
        }

        .login-box a span:nth-child(4) {
          bottom: -100%;
          left: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(360deg, transparent, #fff);
          animation: btn-anim4 1.5s linear infinite;
          animation-delay: 1.125s
        }

        @keyframes btn-anim4 {
          0% {
            bottom: -100%;
          }

          50%,100% {
            bottom: 100%;
          }
        }

        .login-box p:last-child {
          color: #aaa;
          font-size: 14px;
        }

        .login-box a.a2 {
          color: #fff;
          text-decoration: none;
        }

        .login-box a.a2:hover {
          background: transparent;
          color: #aaa;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
